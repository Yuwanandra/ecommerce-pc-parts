require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Parser } = require('json2csv');
const fs = require('fs');
const app = express();
const midtransClient = require('midtrans-client');
const productRoutes = require('./routes/products');
const paymentRoutes = require('./routes/payment');


const SECRET = 'pc_secret';

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/payment', paymentRoutes);

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});


const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admins only' });
  }
  next();
};


app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashed], (err) => {
    if (err) return res.status(400).json({ error: 'Email already exists' });
    res.json({ message: 'User registered' });
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0) {
      console.log('No user found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = results[0];
    console.log('input password:', password);             // ✅ password dari frontend
    console.log('from DB hash:', user.password);          // ✅ hash dari database
    const match = await bcrypt.compare(password, user.password);
    console.log('Password match:', match); // ✅ true or false?

    if (!match) return res.status(401).json({ error: 'Wrong password' });

    const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, SECRET);
    res.json({ token, name: user.name, role: user.role });
  });
});


app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.post('/api/orders', verifyToken, (req, res) => {
  const { products, total } = req.body;
  const user_id = req.user.id;

  db.beginTransaction(err => {
    if (err) return res.status(500).json({ error: 'Transaction error' });

    const orderQuery = 'INSERT INTO orders (user_id, total) VALUES (?, ?)';
    db.query(orderQuery, [user_id, total], (err, result) => {
      if (err) return db.rollback(() => res.status(500).json({ error: err }));

      const order_id = result.insertId;
      const items = products.map(p => [order_id, parseInt(p.product_id), parseInt(p.quantity)]);
      const insertItems = 'INSERT INTO order_items (order_id, product_id, quantity) VALUES ?';

      db.query(insertItems, [items], (err2) => {
        if (err2) return db.rollback(() => res.status(500).json({ error: err2 }));

        let remaining = products.length;

        products.forEach(p => {
          const checkStock = 'SELECT stock FROM products WHERE id = ?';
          db.query(checkStock, [parseInt(p.product_id)], (errCheck, rows) => {
            if (errCheck || rows.length === 0 || rows[0].stock < p.quantity) {
              return db.rollback(() =>
                res.status(400).json({ error: `Not enough stock for product ${p.product_id}` })
              );
            }

            const updateStock = 'UPDATE products SET stock = stock - ? WHERE id = ?';
            db.query(updateStock, [parseInt(p.quantity), parseInt(p.product_id)], (err3, result3) => {
              if (err3 || result3.affectedRows === 0) {
                return db.rollback(() => res.status(500).json({ error: 'Stock update failed' }));
              }

              remaining--;
              if (remaining === 0) {
                db.commit(errCommit => {
                  if (errCommit) return db.rollback(() => res.status(500).json({ error: 'Commit failed' }));

                  // ✅ Panggil res.json hanya SEKALI di sini
                  return res.json({ message: 'Order placed', order_id });
                });
              }
            });
          });
        });
      });

      // ❌ Jangan kirim response di sini! res.json({ ... })
    });
  });
});

app.get('/api/orders/history', verifyToken, (req, res) => {
  const user_id = req.user.id;
  const query = `
    SELECT o.id as order_id, o.total, o.created_at,
           p.name, p.price, oi.quantity
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON p.id = oi.product_id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC`;
  db.query(query, [user_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

app.post('/api/midtrans/token', verifyToken, (req, res) => {
  const { products, total } = req.body;
  const user_id = req.user.id;
  const totalInt = Math.round(total);

  db.beginTransaction(err => {
    if (err) return res.status(500).json({ error: 'Transaction error' });

    const insertOrder = 'INSERT INTO orders (user_id, total) VALUES (?, ?)';
    db.query(insertOrder, [user_id, totalInt], (err, result) => {
      if (err) return db.rollback(() => res.status(500).json({ error: 'Insert order failed' }));

      const order_id = result.insertId;

      const insertItems = 'INSERT INTO order_items (order_id, product_id, quantity) VALUES ?';
      const items = products.map(p => [order_id, p.product_id, p.quantity]);

      db.query(insertItems, [items], (err) => {
        if (err) return db.rollback(() => res.status(500).json({ error: 'Insert items failed' }));

        const snap = new midtransClient.Snap({
          isProduction: false,
          serverKey: process.env.MIDTRANS_SERVER_KEY
        });

        const parameter = {
          transaction_details: {
            order_id: `${order_id}`, // gunakan integer ID sebagai string
            gross_amount: totalInt
          },
          credit_card: { secure: true },
          customer_details: { email: req.user.email }
        };

        snap.createTransaction(parameter)
          .then(transaction => {
            db.commit(); // commit transaksi
            res.json({ token: transaction.token, order_id }); // kirim order_id ke frontend
          })
          .catch(err => {
            db.rollback(() => res.status(500).json({ error: 'Midtrans error' }));
          });
      });
    });
  });
});

app.get('/api/midtrans/test', (req, res) => {
  res.json({
    status: 'ok',
    serverKey: process.env.MIDTRANS_SERVER_KEY ? '✅ exists' : '❌ missing'
  });
});


// 🔐 Admin: get all orders with user info
app.get('/api/admin/export', verifyToken, verifyAdmin, (req, res) => {
  const query = `
    SELECT o.id AS order_id, u.name AS customer, o.total, o.created_at,
           p.name AS product, oi.quantity, p.price
    FROM orders o
    JOIN users u ON u.id = o.user_id
    JOIN order_items oi ON oi.order_id = o.id
    JOIN products p ON p.id = oi.product_id
    ORDER BY o.created_at DESC`;

  db.query(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    const parser = new Parser();
    const csv = parser.parse(rows);
    fs.writeFileSync('orders_export.csv', csv);
    res.download('orders_export.csv', 'orders.csv');
  });
});

app.get('/', (req, res) => {
  res.send('✅ Backend API is running');
});app.listen(3000, () => console.log('Server running on http://localhost:3000'));
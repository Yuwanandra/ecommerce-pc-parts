const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM products');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (results.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.post('/', verifyToken, async (req, res) => {
  const user = req.user;
  if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });

  const { name, category, price, stock, image } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO products (name, category, price, stock, image) VALUES (?, ?, ?, ?, ?)',
      [name, category, price, stock, image]
    );
    res.json({ id: result.insertId, name, category, price, stock, image });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  const user = req.user;
  if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });

  const { name, category, price, stock, image } = req.body;
  try {
    await db.query(
      'UPDATE products SET name=?, category=?, price=?, stock=?, image=? WHERE id=?',
      [name, category, price, stock, image, req.params.id]
    );
    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  const user = req.user;
  if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });

  try {
    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;

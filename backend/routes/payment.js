const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/auth');

// Simpan data pembayaran ke tabel `payments`
router.post('/success', verifyToken, async (req, res) => {
  const { order_id, method, status } = req.body;
  const paid_at = new Date();

  console.log('📥 Incoming payment data:', req.body); // ✅ log input
  console.log('📥 Payment data received:', { order_id, method, status });

  if (!order_id || !method || !status) {
    console.warn('❗ Incomplete request body:', req.body);
    return res.status(400).json({ error: 'Missing payment data' });
  }

  try {
    const [result] = await db.execute(`
      INSERT INTO payments (order_id, method, status, paid_at)
      VALUES (?, ?, ?, ?)`,
      [order_id, method, status, paid_at]
    );

    console.log('✅ Payment saved:', result);

    res.json({ message: '✅ Payment recorded to database' });
  } catch (err) {
    console.error('❌ Error saving payment:', err);
    res.status(500).json({ error: 'Failed to save payment' });
  }
});

// Ambil daftar pembayaran user
router.get('/', verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.query(`
      SELECT payments.*, orders.total 
      FROM payments 
      JOIN orders ON payments.order_id = orders.id
      WHERE orders.user_id = ?
      ORDER BY payments.paid_at DESC
    `, [userId]);

    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetch payments:', err);
    res.status(500).json({ error: 'Failed to load payments' });
  }
});

module.exports = router;
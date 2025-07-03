const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('./auth');

// Simpan payment info ke DB setelah sukses
router.post('/success', verifyToken, (req, res) => {
  const { order_id, total, transaction_id, payment_type, transaction_status } = req.body;
  const user_id = req.user.id;

  if (!order_id || !total || !transaction_id || !payment_type || !transaction_status) {
    return res.status(400).json({ error: 'Incomplete payment info' });
  }

  const sql = `
    INSERT INTO payments (user_id, order_id, total, transaction_id, payment_type, transaction_status)
    VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(sql, [user_id, order_id, total, transaction_id, payment_type, transaction_status], (err) => {
    if (err) {
      console.error('❌ DB Insert Failed:', err);
      return res.status(500).json({ error: 'Failed to save payment' });
    }
    res.json({ message: '✅ Payment recorded successfully' });
  });
});

module.exports = router;
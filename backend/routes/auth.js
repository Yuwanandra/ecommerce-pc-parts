const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const router = express.Router();

const SECRET = process.env.JWT_SECRET || 'pc_secret';

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });

  const hashed = await bcrypt.hash(password, 10);
  const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';

  db.query(query, [name, email, hashed], (err, result) => {
    if (err) return res.status(400).json({ error: 'Email already registered' });
    const token = jwt.sign({ id: result.insertId, name, role: 'user' }, SECRET);
    res.status(201).json({ message: 'User registered', token, name, role: 'user' });
  });
});

module.exports = router;
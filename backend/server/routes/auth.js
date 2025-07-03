const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SECRET = 'pcparts_secret_key';

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
  const users = JSON.parse(fs.readFileSync('./auth/users.json'));
  const exist = users.find(u => u.email === email);
  if (exist) return res.status(409).json({ error: 'Email already exists' });

  const hash = await bcrypt.hash(password, 10);
  const user = { id: Date.now(), name, email, password: hash };
  users.push(user);
  fs.writeFileSync('./auth/users.json', JSON.stringify(users, null, 2));
  res.json({ message: 'User registered' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = JSON.parse(fs.readFileSync('./auth/users.json'));
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, name: user.name }, SECRET, { expiresIn: '1h' });
  res.json({ token, name: user.name });
});

module.exports = router;
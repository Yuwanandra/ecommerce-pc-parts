const express = require('express');
const router = express.Router();
const products = require('../data/products.json');
const verifyToken = require('../middleware/auth');

router.get('/', (req, res) => {
  res.json(products);
});

router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// Example: protected POST route (admin only, future use)
const fs = require('fs');

router.post('/', verifyToken, (req, res) => {
  const user = req.user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only' });
  }
  const products = require('../data/products.json');
  const newProduct = { id: `prod-${Date.now()}`, ...req.body };
  products.push(newProduct);
  fs.writeFileSync('./data/products.json', JSON.stringify(products, null, 2));
  res.json(newProduct);
});

router.delete('/:id', verifyToken, (req, res) => {
  const user = req.user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only' });
  }
  let products = require('../data/products.json');
  products = products.filter(p => p.id !== req.params.id);
  fs.writeFileSync('./data/products.json', JSON.stringify(products, null, 2));
  res.json({ message: 'Product deleted' });
});

router.put('/:id', verifyToken, (req, res) => {
  const user = req.user;
  if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });

  let products = require('../data/products.json');
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });

  products[index] = { ...products[index], ...req.body };
  fs.writeFileSync('./data/products.json', JSON.stringify(products, null, 2));
  res.json(products[index]);
});

module.exports = router;

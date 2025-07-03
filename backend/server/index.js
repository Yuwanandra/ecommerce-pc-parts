const express = require('express');
const cors = require('cors');
const productsRoute = require('../client/src/routes/products');
const authRoute = require('../../client/src/routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/products', productsRoute);
app.use('/api/auth', authRoute);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

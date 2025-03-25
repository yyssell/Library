require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const productsRouter = require('./src/routes/products');
const categoriesRouter = require('./src/routes/categories');
const authorizationRouter = require('./src/routes/authorization')

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'img')));

app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/authorization', authorizationRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

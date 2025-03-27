require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const booksRouter = require('./src/books');
const categoriesRouter = require('./src/categories');
const authorizationRouter = require('./src/authorization');

const app = express();
const port = process.env.SERVER_PORT || 5000;


app.use(cors());
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'img')));

app.use('/books', booksRouter);
app.use('/categories', categoriesRouter);
app.use('/authorization', authorizationRouter);

module.exports = app;

if (require.main === module) {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  module.exports.server = server;
}

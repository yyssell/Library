const express = require('express');
const { Pool } = require('pg');
const { getProductsQuery, getProductByIdQuery } = require('./queries');
const path = require('path');

const router = express.Router();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const server_ip = process.env.SERVER_IP || `http://localhost`;
const port = process.env.SERVER_PORT || 5000;

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(getProductsQuery);

    const productsWithImages = rows.map(product => {
      if (!product.image_path) {
        return {
          ...product,
          image_url: `${server_ip}:${port}/images/${product.category_name}/stock.jpg`
        };
      }

      return {
        ...product,
        image_url: `${server_ip}:${port}/images/${product.category_name}/${product.image_path}`
      };
    });

    res.status(200).json(productsWithImages);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(getProductByIdQuery, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Продукт не найден' });
    }

    const product = {
      ...rows[0],
      image_url: rows[0].image_path
        ? `${server_ip}:${port}/images/${rows[0].category_name}/${rows[0].image_path}`
        : `${server_ip}:${port}/images/${rows[0].category_name}/stock.jpg`
    };

    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;

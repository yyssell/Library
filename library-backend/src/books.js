const express = require('express');
const { Pool } = require('pg');
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
    const { rows } = await pool.query(`
  SELECT
    p.*,
    c.category_name
  FROM Products p
  JOIN Categories c ON p.category_id = c.category_id
`);

    const productsWithImages = rows.map(product => {
      if (!product.image_path) {
        return {
          ...product,
          image_url: `${server_ip}:${port}/images/${product.category_name.replace(/ /g, '_')}/stock.jpg`
        };
      }

      return {
        ...product,
        image_url: `${server_ip}:${port}/images/${product.category_name.replace(/ /g, '_')}/${product.image_path}`
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
    const { rows } = await pool.query(`
  SELECT
    p.*,
    c.category_name
  FROM Products p
  JOIN Categories c ON p.category_id = c.category_id
  WHERE p.product_id = $1
`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Книга не найдена' });
    }

    const product = {
      ...rows[0],
      image_url: rows[0].image_path
        ? `${server_ip}:${port}/images/${rows[0].category_name.replace(/ /g, '_')}/${rows[0].image_path}`
        : `${server_ip}:${port}/images/${rows[0].category_name.replace(/ /g, '_')}/stock.jpg`
    };

    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Создание новой книги
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      category_id,
      unit_price,
      rental_price,
      stock_quantity,
      image_path
    } = req.body;

    const { rows } = await pool.query(`
      INSERT INTO Products (
        name,
        description,
        category_id,
        unit_price,
        rental_price,
        stock_quantity,
        image_path
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7
      ) RETURNING *`,
      [
        name,
        description,
        category_id,
        unit_price,
        rental_price,
        stock_quantity,
        image_path
      ]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка создания книги" });
  }
});

// Обновление книги
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      category_id,
      unit_price,
      rental_price,
      stock_quantity,
      image_path
    } = req.body;

    const { rows } = await pool.query(`
      UPDATE Products SET
        name = $1,
        description = $2,
        category_id = $3,
        unit_price = $4,
        rental_price = $5,
        stock_quantity = $6,
        image_path = $7
      WHERE product_id = $8
      RETURNING *`,
      [
        name,
        description,
        category_id,
        unit_price,
        rental_price,
        stock_quantity,
        image_path,
        id
      ]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Книга не найдена" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка обновления книги" });
  }
});

// Удаление книги
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(`
      DELETE FROM Products
      WHERE product_id = $1
      RETURNING *`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Книга не найдена" });
    }

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка удаления книги" });
  }
});
module.exports = router;

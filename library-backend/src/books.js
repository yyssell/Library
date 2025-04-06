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
// Создание книги
router.post('/', async (req, res) => {
  try {
    const { title, author, description, unit_price, stock_quantity, category_id } = req.body;
    const { rows } = await pool.query(`
      INSERT INTO Products 
        (title, author, description, unit_price, stock_quantity, category_id) 
      VALUES 
        ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [title, author, description, unit_price, stock_quantity, category_id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка создания книги');
  }
});

// Обновление книги
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, description, unit_price, stock_quantity, category_id } = req.body;
    const { rows } = await pool.query(`
      UPDATE Products 
      SET title = $1, author = $2, description = $3, 
          unit_price = $4, stock_quantity = $5, category_id = $6
      WHERE product_id = $7
      RETURNING *`,
      [title, author, description, unit_price, stock_quantity, category_id, id]
    );
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка обновления книги');
  }
});

// Удаление книги
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM Products WHERE product_id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка удаления книги');
  }
});

module.exports = router;

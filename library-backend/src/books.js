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

// Добавление новой книги
router.post('/', async (req, res) => {
  const { name, description, unit_price, rental_price, category_id, image_url, image_path } = req.body;

  try {
    // Проверяем, что все обязательные поля присутствуют
    if (!name || !unit_price || !rental_price || !category_id) {
      return res.status(400).json({ error: 'Недостающие обязательные поля' });
    }

    // Вставка нового продукта в таблицу Products
    const { rows } = await pool.query(`
      INSERT INTO Products (name, description, unit_price, rental_price, category_id, image_path)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING product_id
    `, [name, description, unit_price, rental_price, category_id, image_path]);

    const newProductId = rows[0].product_id;

    // Возвращаем информацию о созданном продукте
    res.status(201).json({
      message: 'Книга успешно создана',
      product_id: newProductId,
      name,
      description,
      unit_price,
      rental_price,
      category_id,
      image_url
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка создания книги');
  }
});

module.exports = router;

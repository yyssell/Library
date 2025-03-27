// authRouter.js
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const authMiddleware = require("../add_ons/authMiddleware");

const router = express.Router();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

router.post('/register',
  [
    body('email').isEmail().normalizeEmail()
      .withMessage('Неверный формат email'), // Добавлено сообщение об ошибке
    body('password').isLength({ min: 6 })
      .withMessage('Пароль должен быть минимум 6 символов'),
    body('phone').custom((value) => { // Кастомная валидация телефона
      const phoneRegex = /^\+7\d{10}$/;
      if (!phoneRegex.test(value)) {
        throw new Error('Телефон должен быть в формате +7XXXXXXXXXX');
      }
      return true;
    }),
    body('last_name').notEmpty()
      .withMessage('Укажите фамилию'),
    body('first_name').notEmpty()
      .withMessage('Укажите имя')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
  return res.status(400).json({
    errors: errors.array().map(err => ({
          param: err.param,
          message: err.msg
        }))
      });
    }

    const { email, password, phone, last_name, first_name, middle_name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // Проверка существования пользователя
      const existingUser = await pool.query(
        'SELECT * FROM Customers WHERE email = $1 OR phone = $2',
        [email, phone]
      );

      if (existingUser.rows.length > 0) {
        return res.status(409).json({ error: 'Пользователь уже существует' });
      }

      // Создание пользователя
      const newUser = await pool.query(
        `INSERT INTO Customers (
          last_name, first_name, middle_name, phone, email, password_hash
        ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [last_name, first_name, middle_name, phone, email, hashedPassword]
      );

      // Назначение роли по умолчанию
      const role = await pool.query(
        'SELECT role_id FROM Roles WHERE role_name = $1',
        ['client']
      );

      await pool.query(
        'INSERT INTO User_Roles (customer_id, role_id) VALUES ($1, $2)',
        [newUser.rows[0].customer_id, role.rows[0].role_id]
      );

      res.status(201).json({ message: 'Пользователь зарегистрирован' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
});

router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await pool.query(
        `SELECT c.*, r.role_name FROM Customers c
         JOIN User_Roles ur ON c.customer_id = ur.customer_id
         JOIN Roles r ON ur.role_id = r.role_id
         WHERE c.email = $1`,
        [email]
      );

      if (user.rows.length === 0) {
        return res.status(404).json({ error: `Пользователь "${email}" не найден` });
      }

      const validPassword = await bcrypt.compare(
        password,
        user.rows[0].password_hash
      );

      if (!validPassword) {
        return res.status(401).json({ error: 'Неверный пароль' });
      }

      const token = jwt.sign(
        {
          id: user.rows[0].customer_id,
          roles: user.rows.map(r => r.role_name),
          user: user.rows[0],
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
});


router.put('/change-password', authMiddleware,
  [
    body('oldPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.user;
    const { oldPassword, newPassword } = req.body;

    try {
      const user = await pool.query(
        'SELECT password_hash FROM Customers WHERE customer_id = $1',
        [userId]
      );

      if (user.rows.length === 0) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }

      const validPassword = await bcrypt.compare(
        oldPassword,
        user.rows[0].password_hash
      );

      if (!validPassword) {
        return res.status(401).json({ error: 'Неверный старый пароль' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await pool.query(
        'UPDATE Customers SET password_hash = $1 WHERE customer_id = $2',
        [hashedPassword, userId]
      );

      res.json({ message: 'Пароль успешно изменен' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
});

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await pool.query(
      `SELECT c.*, ARRAY_AGG(r.role_name) AS roles 
       FROM Customers c
       JOIN User_Roles ur ON c.customer_id = ur.customer_id
       JOIN Roles r ON ur.role_id = r.role_id
       WHERE c.customer_id = $1
       GROUP BY c.customer_id`,
      [req.user.id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
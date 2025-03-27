import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/AuthPage.module.css";
import {AuthRegister} from "../modules/Api.js";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    last_name: '',
    first_name: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await AuthRegister(formData);
      navigate('/login');
    } catch (err) {
      setError(`Ошибка регистрации. Проверьте данные ${err}`);
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2>Регистрация</h2>
      {error && <div className={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="last_name"
          placeholder="Фамилия"
          value={formData.last_name}
          onChange={handleChange}
          required
          className={styles.authInput}
        />
        <input
          type="text"
          name="first_name"
          placeholder="Имя"
          value={formData.first_name}
          onChange={handleChange}
          required
          className={styles.authInput}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className={styles.authInput}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Телефон"
          value={formData.phone}
          onChange={handleChange}
          required
          className={styles.authInput}
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleChange}
          required
          className={styles.authInput}
        />
        <button type="submit" className={styles.authButton}>Зарегистрироваться</button>
      </form>
      <p>
        Есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
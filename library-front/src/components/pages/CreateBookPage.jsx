import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBook } from "../modules/Api.js";  // Импортируем функцию createBook
import styles from "../styles/CreateBookPage.module.css"; // Путь к стилям

const CreateBookPage = ({ token }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [unit_price, setUnitPrice] = useState("");
  const [rental_price, setRentalPrice] = useState("");
  const [category_id, setCategoryId] = useState("");
  const [image_url, setImageUrl] = useState("");
  const [image_path, setImagePath] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const bookData = {
      name,
      description,
      unit_price,
      rental_price,
      category_id,
      image_url,
      image_path
    };

    try {
      const response = await createBook(bookData, token);
      if (response.message === 'Книга успешно создана') {
        navigate("/books");  // Перенаправляем на страницу списка книг
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Создать новую книгу</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Название:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Описание:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Цена:</label>
          <input
            type="number"
            value={unit_price}
            onChange={(e) => setUnitPrice(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Цена аренды:</label>
          <input
            type="number"
            value={rental_price}
            onChange={(e) => setRentalPrice(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Категория:</label>
          <select
            value={category_id}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Выберите категорию</option>
            {/* Здесь можно динамически загрузить категории */}
            <option value="1">Категория 1</option>
            <option value="2">Категория 2</option>
            {/* Замените на реальные категории */}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>URL изображения:</label>
          <input
            type="text"
            value={image_url}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Путь к изображению:</label>
          <input
            type="text"
            value={image_path}
            onChange={(e) => setImagePath(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Создание..." : "Создать"}
        </button>
      </form>
    </div>
  );
};

export default CreateBookPage;

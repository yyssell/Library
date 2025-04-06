import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createBook, getCategories } from "../modules/Api.js"; // Добавлен импорт getCategories [[3]]
import styles from "../styles/CreateBookPage.module.css";

const CreateBookPage = ({ token }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]); // Состояние для категорий [[3]]
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    unit_price: 0,
    rental_price: 0,
    category_id: "",
    stock_quantity: 0, // Добавлено обязательное поле [[1]]
    image_path: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Загрузка категорий при монтировании [[3]]
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        setError("Ошибка загрузки категорий");
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await createBook(formData, token);
      if (response.status === 201) { // Проверка статуса ответа [[2]]
        navigate("/books");
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Ошибка создания книги"); // Обработка ошибок [[2]]
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
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Описание:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Цена:</label>
          <input
            type="number"
            name="unit_price"
            value={formData.unit_price}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Цена аренды:</label>
          <input
            type="number"
            name="rental_price"
            value={formData.rental_price}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Категория:</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
          >
            <option value="">Выберите категорию</option>
            {categories.map(cat => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.category_name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Количество:</label>
          <input
            type="number"
            name="stock_quantity"
            value={formData.stock_quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Путь к изображению:</label>
          <input
            type="text"
            name="image_path"
            value={formData.image_path}
            onChange={handleChange}
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
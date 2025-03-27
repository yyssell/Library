// ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../modules/Api.js";
import styles from "../styles/ProductDetail.module.css";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        console.error("Ошибка загрузки товара:", err);
        setError("Не удалось загрузить товар");
        setProduct(null);
      }
    };

    fetchProduct();
  }, [id]);

  if (error) return <div className={styles.error}>{error}</div>;
  if (!product) return <div className={styles.loading}>Загрузка...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <img
          src={product.image_url}
          alt={product.name}
          className={styles.heroImage}
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/1200x600?text=No+Image";
          }}
        />
        <div className={styles.heroOverlay}>
          <h1 className={styles.heroTitle}>{product.name}</h1>
        </div>
      </div>

      <div className={styles.detailsCard}>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <h3 className={styles.infoTitle}>Состав</h3>
            <p className={styles.infoValue}>
              {product.composition || "Не указано"}
            </p>
          </div>
          <div className={styles.infoItem}>
            <h3 className={styles.infoTitle}>Вес</h3>
            <p className={styles.infoValue}>
              {product.weight ? `${product.weight} г` : "Не указано"}
            </p>
          </div>
          <div className={styles.infoItem}>
            <h3 className={styles.infoTitle}>Пищевая ценность</h3>
            <ul className={styles.nutritionList}>
              <li>Калории: {product.calories || "N/A"} ккал</li>
              <li>Белки: {product.proteins || "N/A"} г</li>
              <li>Жиры: {product.fats || "N/A"} г</li>
              <li>Углеводы: {product.carbohydrates || "N/A"} г</li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.actionBar}>
        <span className={styles.price}>{product.unit_price} ₽</span>
        <button className={styles.addToCart}>В корзину</button>
      </div>
    </div>
  );
};

export default ProductDetail;

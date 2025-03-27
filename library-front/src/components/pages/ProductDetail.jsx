// ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBooksById } from "../modules/Api.js";
import styles from "../styles/ProductDetail.module.css";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [daysCount, setDaysCount] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getBooksById(id);
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

  const incrementDays = () => setDaysCount(prev => prev + 1);
  const decrementDays = () => setDaysCount(prev => (prev > 1 ? prev - 1 : prev));

  const totalRentalCost = (product.rental_price * daysCount).toFixed(2)

  return (
    <div className={styles.productContainer}>
      <div className={styles.imageContainer}>
        <img
          src={product.image_url}
          alt={product.name}
          className={styles.productImage}
          onError={(e) => (e.target.src = "/placeholder.jpg")}
        />
      </div>
      <div className={styles.detailsContainer}>
        <h1 className={styles.productName}>{product.name}</h1>
        <p className={styles.productAuthor}>{product.description}</p>
        <div className={styles.metaInfo}>
          <span className={styles.categoryBadge}>{product.category_name}</span>
          <span className={styles.stockStatus}>
            В наличии: {product.stock_quantity} шт.
          </span>
        </div>
        <div className={styles.priceSection}>
          <div className={styles.priceItem}>
            <span className={styles.priceLabel}>Залоговая стоимость:</span>
            <span className={styles.priceValue}>{product.unit_price} ₽</span>
          </div>
          <div className={styles.priceItem}>
            <span className={styles.priceLabel}>Аренда:</span>
            <span className={styles.priceValue}>{product.rental_price} ₽/день</span>
          </div>
        </div>

        <div className={styles.rentBlock}>
          <span className={styles.priceLabel}>Расчет стоимости аренды:</span>
          <div className={styles.rentalControls}>
            <div className={styles.daysControl}>
              <button
                  className={styles.controlButton}
                  onClick={decrementDays}
                  disabled={daysCount === 1}
              >
                -
              </button>
              <span className={styles.daysCount}>{daysCount} дней</span>
              <button
                  className={styles.controlButton}
                  onClick={incrementDays}
              >
                +
              </button>
            </div>

            <div className={styles.totalBlock}>
        <span className={styles.totalCost}>
          Итого: {totalRentalCost} ₽
        </span>
              <button className={styles.cart_button}>
                <img src={'../../../shopping-cart.png'}/>
              </button>
            </div>
          </div>

          <div className={styles.cartButtonContainer}>

          </div>
        </div>


      </div>
    </div>
  );
};

export default ProductDetail;
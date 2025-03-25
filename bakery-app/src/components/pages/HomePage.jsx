// src/pages/HomePage.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "../styles/HomePage.module.css";
import * as XLSX from 'xlsx';
import { getCategories, getProducts } from "../modules/Api.js";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [loading, setLoading] = useState(true);

    const handleExport = () => {
      const ws = XLSX.utils.json_to_sheet(sortedProducts.map(product => ({
        Название: product.name,
        Цена: product.unit_price,
        Категория: categories.find(cat => cat.id === product.category_id)?.name || 'Без категории',
        Описание: product.description,
        Количество: product.stock_quantity
      })));

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Товары");
      XLSX.writeFile(wb, "товары.xlsx");
    };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);

        const formattedCategories = [
          { id: null, name: "Все" },
          ...categoriesRes.data.map((cat) => ({
            id: cat.category_id,
            name: cat.category_name,
          })),
        ];

        setCategories(formattedCategories);
        setAllProducts(productsRes.data);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Комбинированный фильтр
  const filteredProducts = useMemo(() => {
    let result = allProducts;

    // Фильтрация по категории
    if (selectedCategory) {
      result = result.filter(p => p.category_id === selectedCategory);
    }

    // Поиск по названию и описанию
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
      );
    }

    return result;
  }, [allProducts, selectedCategory, searchQuery]);

  // Сортировка с учётом типа данных
  const sortedProducts = useMemo(() => {
    let sortableProducts = [...filteredProducts];
    if (!sortConfig.key) return sortableProducts;

    sortableProducts.sort((a, b) => {
      // Числовые поля
      if (['unit_price', 'stock_quantity'].includes(sortConfig.key)) {
        return sortConfig.direction === 'asc'
          ? a[sortConfig.key] - b[sortConfig.key]
          : b[sortConfig.key] - a[sortConfig.key];
      }

      // Строковые поля
      const valA = a[sortConfig.key]?.toString().toLowerCase() || '';
      const valB = b[sortConfig.key]?.toString().toLowerCase() || '';

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sortableProducts;
  }, [filteredProducts, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  if (loading) return <div className={styles.loading}>Загрузка...</div>;

  return (
    <div className={styles.container}>
      {/* Панель поиска */}
      <div className={styles.searchPanel}>
        <input
          type="text"
          placeholder="Поиск по названию и описанию..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Панель управления */}
      <div className={styles.controls}>
        <div className={styles.categoryButtons}>
          {categories.map(category => (
            <button
              key={category.id ?? 'all'}
              className={`${styles.categoryButton} ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <button
            onClick={handleExport}
            className={`${styles.categoryButton} ${styles.exportButton}`}
          >Скачать в XLSX</button>

        <div className={styles.sortPanel}>
          <select
            value={sortConfig.key || ''}
            onChange={(e) => handleSort(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="">Сортировать по</option>
            <option value="name">Названию</option>
            <option value="unit_price">Цене</option>
            <option value="stock_quantity">Наличию</option>
          </select>
          <span
            className={styles.sortDirection}
            onClick={() => handleSort(sortConfig.key)}
          >
            {sortConfig.direction === 'asc' ? '▲' : '▼'}
          </span>
        </div>
      </div>

      {/* Список продуктов */}
      <div className={styles.productsGrid}>
        {sortedProducts.map(product => (
          <Link
            to={`/product/${product.product_id}`}
            key={product.product_id}
            className={styles.productCard}
          >
            <div className={styles.productImageContainer}>
              <img
                      src={product.image_url}
                      alt={product.name}
                      className={styles.productImage}
                      onError={(e) => {
                        e.target.src =
                            "https://avatars.mds.yandex.net/i?id=e5b5c6e2a8c8716e772eaeaa4df3410d_l-10135049-images-thumbs&n=13";
                      }}
                  />
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.productDescription}>
                    {product.description}
                  </p>
                  <div className={styles.productFooter}>
                    <span className={styles.price}>{product.unit_price} ₽</span>
                    <button className={styles.addToCart}>В корзину</button>
                  </div>
                </div>
              </Link>
          ))}
        </div>
      </div>
  );
};

export default HomePage;
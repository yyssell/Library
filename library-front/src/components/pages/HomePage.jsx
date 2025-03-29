import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "../styles/HomePage.module.css";
import * as XLSX from 'xlsx';
import { getCategories, getBooks } from "../modules/Api.js";
import { useAuth } from "../components/AuthContext";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]); // Изменено на массив
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
	
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
          getBooks(),
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

  // Обработчик выбора категории с поддержкой множественного выбора
  const handleCategorySelect = (categoryId) => {
    setSelectedCategories(prev => {
      if (categoryId === null) return []; // Выбор "Все" сбрасывает остальные
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      }
      return [...prev, categoryId];
    });
  };

  // Комбинированный фильтр
  const filteredProducts = useMemo(() => {
    let result = allProducts;

    // Фильтрация по категориям
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category_id));
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
  }, [allProducts, selectedCategories, searchQuery]);

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

  return (
    <div className={styles.container}>
      {/* Блок фильтров */}
      <div className={styles.filters}>
        <input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
        />

        <div className={styles.categoryList}>
          {categories.map(cat => (
              <div key={cat.id} className={styles.categoryItem}>
                <input
                    type="checkbox"
                    id={`cat-${cat.id}`}
                    checked={selectedCategories.includes(cat.id) || (cat.id === null && selectedCategories.length === 0)}
                    onChange={() => handleCategorySelect(cat.id)}
                    className={styles.checkbox}
                />
                <label htmlFor={`cat-${cat.id}`}>{cat.name}</label>
              </div>
          ))}
        </div>

  
<div className={styles.sortPanel}>
  {user?.roles?.includes('Директор') && (
          <button
            onClick={handleExport}
            className={`${styles.categoryButton} ${styles.exportButton}`}
          >
            Скачать в XLSX
          </button>
        )}

  <div className={styles.sortControls}>
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
      {sortConfig.direction === 'asc' ? '↑' : '↓'}
    </span>
 	 </div>
	</div>




	</div>
	

      

      {/* Список книг */}
      <div className={styles.productGrid}>
        {sortedProducts.map(product => (
            <Link
                to={`/books/${product.product_id}`}
                key={product.product_id}
                    className={styles.productCard}
                ><img
                  src={product.image_url}
                  alt={product.name}
                  className={styles.productImage}
              />
              <h3 className={styles.book_name}>{product.name}</h3>
              <p>{product.description}</p>
              <div className={styles.get_block}>
                <div className={styles.price}>
                  <span>{product.rental_price} ₽/день</span>
                  <span>{product.unit_price} ₽</span>
                </div>
                <button className={styles.cart_button}>
                <img src={'../../../shopping-cart.png'}/>
                </button>
              </div>

            </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;

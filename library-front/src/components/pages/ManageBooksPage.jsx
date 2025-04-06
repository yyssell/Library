import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/ManageBooksPage.module.css"; // можно переименовать, если нужно
import * as XLSX from 'xlsx';
import { getCategories, getBooks } from "../modules/Api.js";
import { useAuth } from "../context/AuthContext";

const ManageBookPage = () => {
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(sortedProducts.map(product => ({
      ID: product.product_id,
      Название: product.name,
      Описание: product.description,
      Категория: product.category_name,
      Цена: product.unit_price,
      Аренда: product.rental_price,
      Количество: product.stock_quantity,
      Путь_к_изображению: product.image_path,
      URL_изображения: product.image_url
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

  const handleCategorySelect = (categoryId) => {
    setSelectedCategories(prev => {
      if (categoryId === null) return [];
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      }
      return [...prev, categoryId];
    });
  };

  const filteredProducts = useMemo(() => {
    let result = allProducts;
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category_id));
    }
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
      if (['unit_price', 'rental_price', 'stock_quantity', 'product_id'].includes(sortConfig.key)) {
        return sortConfig.direction === 'asc'
          ? parseFloat(a[sortConfig.key]) - parseFloat(b[sortConfig.key])
          : parseFloat(b[sortConfig.key]) - parseFloat(a[sortConfig.key]);
      }
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
  const handleDelete = (productId) => {
  if (window.confirm("Вы уверены, что хотите удалить этот товар?")) {
    setAllProducts(prev => prev.filter(p => p.product_id !== productId));
    // TODO: Добавить API вызов для удаления на сервере
  }
};


  return (
    <div className={styles.container}>
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
              <div className={styles.buttonsContainer}>
            <button
              onClick={handleExport}
              className={`${styles.categoryButton} ${styles.exportButton}`}
            >
              Скачать в XLSX
            </button>
              <Link
                to="/books/create"
                className={`${styles.categoryButton}`}
                style={{ background: "#4b52f8", color: "white" }}
              >
                Создать новый элемент
              </Link>
              </div>
          )}
          <div className={styles.sortControls}>
            <select
              value={sortConfig.key || ''}
              onChange={(e) => handleSort(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="">Сортировать по</option>
              <option value="product_id">ID</option>
              <option value="name">Названию</option>
              <option value="unit_price">Цене</option>
              <option value="rental_price">Аренде</option>
              <option value="stock_quantity">Наличию</option>
              <option value="category_name">Категории</option>
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

      <div className={styles.tableContainer}>
        <table className={styles.productTable}>
          <thead>
          <tr>
            <th onClick={() => handleSort('product_id')}>ID</th>
            <th>Изображение</th>
            <th onClick={() => handleSort('name')}>Название</th>
            <th>Описание</th>
            <th onClick={() => handleSort('unit_price')}>Цена</th>
            <th onClick={() => handleSort('rental_price')}>Аренда</th>
            <th onClick={() => handleSort('stock_quantity')}>Количество</th>
            <th onClick={() => handleSort('category_name')}>Категория</th>
            <th>image_path</th>
            <th>image_url</th>
            <th>Действия</th>
            {/* Новый столбец */}
          </tr>
          </thead>
          <tbody>
          {sortedProducts.map(product => (
              <tr key={product.product_id}>
                <td>{product.product_id}</td>
                <td>
                  <img
                      src={product.image_url}
                      alt={product.name}
                      style={{width: 50, height: 50, objectFit: "cover"}}
                  />
                </td>
                <td>
                  <Link to={`/books/${product.product_id}`} className={styles.link}>
                    {product.name}
                  </Link>
                </td>
                <td>{product.description}</td>
                <td>{product.unit_price} ₽</td>
                <td>{product.rental_price} ₽/день</td>
                <td>{product.stock_quantity}</td>
                <td>{product.category_name}</td>
                <td>{product.image_path}</td>
                <td>{product.image_url}</td>
                <td>
                  <Link
                      to={`/edit/${product.product_id}`}
                      className={`${styles.actionButton} ${styles.editButton}`}
                  >
                    Редактировать
                  </Link>
                  <button
                      onClick={() => handleDelete(product.product_id)}
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
          ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default ManageBookPage;

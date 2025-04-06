import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/HomePage.module.css";
import { getBooks, deleteBook, updateBook, createBook } from "../modules/Api.js";
import { useAuth } from "../context/AuthContext";

const ManageBooksPage = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getBooks();
        setBooks(response.data);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    if (!searchQuery) return books;
    const query = searchQuery.toLowerCase();
    return books.filter(book =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
    );
  }, [books, searchQuery]);

  const sortedBooks = useMemo(() => {
    if (!sortConfig.key) return filteredBooks;
    return [...filteredBooks].sort((a, b) => {
      if (['unit_price', 'stock_quantity'].includes(sortConfig.key)) {
        return sortConfig.direction === 'asc'
          ? a[sortConfig.key] - b[sortConfig.key]
          : b[sortConfig.key] - a[sortConfig.key];
      }
      const valA = a[sortConfig.key]?.toString().toLowerCase() || '';
      const valB = b[sortConfig.key]?.toString().toLowerCase() || '';
      return sortConfig.direction === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });
  }, [filteredBooks, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Удалить книгу?")) {
      try {
        await deleteBook(id, user.token);
        setBooks(prev => prev.filter(book => book.product_id !== id));
      } catch (error) {
        console.error("Ошибка удаления:", error);
      }
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
          <div className={styles.sortControls}>
            <select
                value={sortConfig.key || ''}
                onChange={(e) => handleSort(e.target.value)}
                className={styles.sortSelect}
            >
              <option value="">Сортировать по</option>
              <option value="title">Названию</option>
              <option value="author">Автору</option>
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

        <table className={styles.dataTable}>
          <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Автор</th>
            <th>Категория</th>
            <th>Цена продажи</th>
            <th>Цена аренды</th>
            <th>В наличии</th>
            <th>Действия</th>
          </tr>
          </thead>
          <tbody>
          {sortedBooks.map(book => (
              <tr key={book.product_id}>
                <td>{book.product_id}</td>
                <td>{book.name}</td>
                <td>{book.description}</td>
                {/* В вашем примере здесь указан автор [[1]] */}
                <td>{book.category_name}</td>
                <td>{book.unit_price} ₽</td>
                <td>{book.rental_price} ₽/день</td>
                <td>{book.stock_quantity} шт.</td>
                <td>
                  <button
                      className={styles.editBtn}
                      onClick={() => updateBook(book)}
                  >
                    Редактировать
                  </button>
                  <button
                      className={styles.deleteBtn}
                      onClick={() => deleteBook(book.product_id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  );
};

export default ManageBooksPage;
import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './styles/Header.module.css';
import {useAuth} from "./context/AuthContext.jsx";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
        logout();
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.container}`}>
        <Link to="/" className={`text-decoration-none text-dark fs-3 fw-bold ${styles.navLink}`}>
          Вкусная Булочка
        </Link>

        <nav className={styles.nav}>
          <Link to="/catalog" className={styles.navLink}>Каталог</Link>
          <Link to="/about" className={styles.navLink}>О нас</Link>
          <Link to="/contacts" className={styles.navLink}>Контакты</Link>
        </nav>
        <div>
          {user ? (
              <div className={styles.nav}>
                <Link to="/profile" className={`${styles.btn} ${styles.btnOutline}`}>
                  Профиль
                </Link>
                <Link to="/" className={styles.btn} onClick={handleLogout}>
                  Выйти
                </Link>
              </div>
          ) : (
              <div className={styles.nav}>
                <Link to="/login" className={`${styles.btn} ${styles.btnOutline}`}>
                  Войти
                </Link>
                <Link to="/register" className={styles.btn}>
                  Регистрация
                </Link>
              </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ProfilePage.module.css";
import { Profile } from "../modules/Api.js";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("auth");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await Profile(token);
        setUser(response.data);
      } catch (err) {
        setError("Ошибка загрузки профиля");
        console.error(err);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (error) return <div className={styles.error}>{error}</div>;
  if (!user) return <div className={styles.loading}>Загрузка...</div>;

  return (
    <div className={styles.profileContainer}>
      {error && <div className={styles.error}>{error}</div>}
      {!user ? (
        <div className={styles.loading}>Загрузка...</div>
      ) : (
        <>
          <div className={styles.profileHeader}>
            <h2 className={styles.profileTitle}>Мой профиль</h2>
          </div>

          <div className={styles.userInfo}>
            <div className={styles.infoSection}>
              <span className={styles.infoLabel}>ФИО</span>
              <span className={styles.infoValue}>
                {user.last_name} {user.first_name} {user.middle_name}
              </span>
            </div>

            <div className={styles.infoSection}>
              <span className={styles.infoLabel}>Телефон</span>
              <span className={styles.infoValue}>{user.phone}</span>
            </div>

            <div className={styles.infoSection}>
              <span className={styles.infoLabel}>Email</span>
              <span className={styles.infoValue}>{user.email}</span>
            </div>

            <div className={styles.infoSection}>
              <span className={styles.infoLabel}>Роли</span>
              <div className={styles.rolesContainer}>
                {user.roles.map(role => (
                  <span key={role} className={styles.roleChip}>{role}</span>
                ))}
              </div>
            </div>

            <span className={styles.registrationDate}>
              Зарегистрирован: {new Date(user.dateregistration).toLocaleDateString()}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;

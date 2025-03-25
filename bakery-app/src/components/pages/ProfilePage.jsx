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
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.avatar}>
          <span>{user.first_name[0]}{user.last_name[0]}</span>
        </div>
        <h1 className={styles.name}>
          {user.first_name} {user.last_name}
        </h1>
        <p className={styles.email}>{user.email}</p>
        <div className={styles.info}>
          <p><strong>ID:</strong> {user.customer_id}</p>
          <p><strong>Телефон:</strong> {user.phone}</p>
          <p><strong>Роли:</strong> {user.roles.join(", ")}</p>
          <p><strong>Дата регистрации:</strong> {new Date(user.dateregistration).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

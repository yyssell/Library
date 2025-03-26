# Bakery_React.js_PostgreSQL
Сайт булочной написанный на React.js с подключением БД PostgreSQL

## Требования
- PostgreSQL
- Node.js (v18+)
- Git

---

### 1. Установка PostgreSQL
#### Для Linux:
```bash
# Установка PostgreSQL
sudo apt update && sudo apt install postgresql postgresql-contrib

# Смена пароля пользователя postgres (установить 1234)
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD '1234';" 

# Создание базы данных "bakery"
sudo -u postgres createdb bakery
```

#### Для Windows:
- Скачайте установщик с [официального сайта](https://www.postgresql.org/download/)
- Укажите пароль `1234` для пользователя `postgres` во время установки 

---

### 2. Заполнение базы данных
```bash
# Перейдите в папку с SQL-скриптом
cd bakery-backend/PostgreSQL_data

# Импорт данных
psql -U postgres -d bakery -f bakery_data.sql
```

---

### 3. Установка Node.js
```bash
# Установка Node.js (Linux)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

node -v
npm -v 
```

---

### 4. Настройка проекта
#### В backend-проекте:
```bash
# Установка зависимостей
cd bakery-backend
npm install

# Настройка .env
cp .env.example .env
```
В файле `.env` укажите:
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=bakery
DB_PASSWORD=1234
DB_PORT=5432

JWT_SECRET=zRKIWr7z2uoKrBtUJ2LFceOB-dslR9ZTzHjNghIo5ZY

SERVER_IP=http://localhost
SERVER_PORT=5000
```

#### В frontend-проекте:
```bash
cd bakery-app
npm install

# Настройка Api.js
# В файле src/components/modules/Api.js укажите:
const API_URL = 'http://localhost:5000'
```

---

### 5. Настройка брандмауэра
```bash
# Для Linux (открытие портов)
sudo ufw allow 5432/tcp  # PostgreSQL
sudo ufw allow 3000/tcp  # React
sudo ufw allow 5000/tcp  # Express

# Для Windows
# Включите порты через "Брандмауэр Windows" в Панели управления
```

---

### 6. Запуск проекта
#### В backend-проекте:
```bash
cd bakery-backend
npm run dev
```

#### В frontend-проекте:
```bash
cd bakery-app
npm start
```

---

### Структура проекта
```
.
├── bakery-app/          # React-фронтенд
│   ├── public/
│   ├── src/
│   └── package.json
└── bakery-backend/      # Express-бэкенд
    ├── PostgreSQL_data/ # SQL-скрипты
    ├── .env
    └── server.js
```

---

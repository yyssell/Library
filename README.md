# Bakery_Reacrt.js_PostgreSQL
Сайт булочной написанный на React.js с подключением бд PostgreSQL

### Что что всем этим добром делать?
1. Прописать **_npm install_** в каждой папке
2. Создать базу данных PostgreSQL, заполнить ее скриптами в [PostgreSQL_data](bakery-backend%2FPostgreSQL_data)
3. В [Api.js](bakery-app%2Fsrc%2Fcomponents%2Fmodules%2FApi.js) и [.env](bakery-backend%2F.env) фронта и бэка написать адрес сервера, данные для подключения к бд
4. Разрешить маршрутизацию по портам 

#### Linux

1. **Открытие порта с помощью iptables:**

   Откройте терминал и выполните следующие команды:

   ```bash
   sudo iptables -A INPUT -p tcp --dport 5173 -j ACCEPT
   sudo iptables-save
   ```

2. **Открытие порта с помощью ufw (Uncomplicated Firewall):**

   Если вы используете ufw, выполните следующие команды:

   ```bash
   sudo ufw allow 5173/tcp
   sudo ufw reload
   ```
   
5. Прописать **_npm run dev_** в каждой папке
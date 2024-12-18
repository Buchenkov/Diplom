
const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000; // Обновите порт на 8000

app.use(cors()); // Позволяет кросс-доменные запросы
app.use(express.json());

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  console.log('Получен запрос на логин:', username, password); // Логирование входящих данных

  // Пример проверки логина и пароля
  if (username === 'admin' && password === 'password') {
    res.json({
      token: 'example-token',
      tokenExpire: new Date().getTime() + 3600000, // Пример времени истечения токена (1 час)
    });
  } else {
    console.error('Неверный логин или пароль'); // Логирование ошибки
    res.status(401).json({ message: 'Неверный логин или пароль' });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});

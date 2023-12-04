const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// MySQL 연결 설정
const connection = mysql.createConnection({
  host: 'white3332',
  user: 'white3332',
  password: 'white3332',
  database: 'times',
});

connection.connect(err => {
  if (err) {
      console.error('Error connecting to MySQL:', err);
  } else {
      console.log('Connected to MySQL');
  }
});

// CORS 미들웨어 추가
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // 모든 도메인 허용 (보안상 취약성 주의)
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// ID로 검색하여 times 반환하는 API
app.get('/getTimes/:id', (req, res) => {
  const userId = req.params.id;

  const query = 'SELECT times FROM user_data WHERE user_id = ?';

  connection.query(query, [userId], (err, results) => {
    if (err) {
        console.error('Error executing query:', err);
        return res.status(500).send('Internal Server Error');
    }

    if (results.length > 0) {
        res.json(results[0].times);
    } else {
        // 존재하지 않는 아이디를 조회한 경우
        res.status(404).send('입력하신 아이디가 존재하지 않습니다.');
    }
  });
});

// ID와 times를 받아서 데이터베이스에 저장하는 API
app.post('/saveTimes', (req, res) => {
  const { id, times } = req.body;

  const query = 'INSERT INTO user_data (user_id, times) VALUES (?, ?) ON DUPLICATE KEY UPDATE times = ?';

  connection.query(query, [id, JSON.stringify(times)], (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).send('Internal Server Error');
      } else {
          res.send('Data saved successfully');
      }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
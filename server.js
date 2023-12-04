const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// MySQL 연결 설정
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'white3332',
  password: '123456',
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

// Parse application/json
app.use(bodyParser.json());


// ID로 검색하여 times 반환하는 API
app.get('/getTimes/:id', (req, res) => {
  const userId = req.params.id;

  const query = 'SELECT times FROM times WHERE id = ?';  // 테이블 이름 수정

  connection.query(query, userId, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (results.length > 0) {
      const times = JSON.parse(results[0].times);  // JSON 문자열을 JavaScript 객체로 변환
      res.json(times);
    } else {
      // 존재하지 않는 아이디를 조회한 경우
      res.status(404).send('입력하신 아이디가 존재하지 않습니다.');
    }
  });
});


// ID와 times를 받아서 데이터베이스에 저장하는 API
app.post('/saveTimes', async (req, res) => {
  const { id, times } = req.body;
  const placeholders = times.map(() => '?').join(', ');  // Generate placeholders for the update part
  const query = `
    INSERT INTO times (id, times) 
    VALUES (?, ?) 
    ON DUPLICATE KEY UPDATE times = VALUES(times)`;
  const queryValues = [id, JSON.stringify(times), ...times];  // Include individual times for the update part

  try {
    const results = await new Promise((resolve, reject) => {
      connection.query(query, queryValues, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    res.send('Data saved successfully');
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send(`Error executing query: ${error.message}`);
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});




// Express 서버 설정
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// MongoDB 연결 설정

var MONGODB_URL = 'mongodb+srv://white3332:white3332@db.kgic98h.mongodb.net/?retryWrites=true&w=majority';
var client = mongoose.connect(MONGODB_URL);

// Connect to the MongoDB server
client.connect(err => {
  if (err) {
    console.error('Failed to connect to the database', err);
    return;
  }

  // Database instance
  const db = client.db('blog');

// API 핸들러 구현 - 데이터 저장
app.post('/api/data', async (req, res) => {
  const id = req.body.id; // 클라이언트에서 전달한 id 파라미터
  const times = req.body.times; // 클라이언트에서 전달한 times 파라미터

  // 여기에서 데이터를 MongoDB에 저장하는 등의 작업 수행
  const collection = db.collection('blog');
  
  // 예시: MongoDB에 데이터 삽입
  const result = await collection.insertOne({ id, times });

  res.json({ success: true, insertedId: result.insertedId });
});

// API 핸들러 구현 - 데이터 가져오기
app.get('/api/data', async (req, res) => {
  const id = req.query.id; // 클라이언트에서 전달한 id 파라미터
  const times = req.query.times; // 클라이언트에서 전달한 times 파라미터

  // 여기에서 데이터를 MongoDB에서 가져오는 등의 작업 수행
  const collection = db.collection('blog');
  const result = await collection.findOne({ id, times });

  // 예시: 가져온 데이터를 JSON 형태로 클라이언트에 응답
  if (result) {
    res.json(result);
  } else {
    res.json({ error: 'Data not found' });
  }
});


  // Start the server
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
});

// Close the connection when the app is terminated
process.on('SIGINT', () => {
  client.close();
  process.exit();
});

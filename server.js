const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;
const username = encodeURIComponent("white3332");
const password = encodeURIComponent("white3332");
const cluster = "db.kgic98h.mongodb.net";
const databaseName = "blog";
const collectionName = "times";

const uri = `mongodb+srv://${username}:${password}@${cluster}/${databaseName}?retryWrites=true&w=majority`;

// 미들웨어 설정
app.use(express.json());


// 루트 엔드포인트
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// fetch data 엔드포인트
app.get('/getData', async (req, res) => {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db(databaseName);
    const collection = database.collection(collectionName);

    const cursor = collection.find();
    const result = await cursor.toArray();
    console.log('Data retrieved from MongoDB:', result);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error retrieving data from MongoDB:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    await client.close();
    console.log('Connection to MongoDB closed');
  }
});




// insertData 엔드포인트
app.post('/insertData', async (req, res) => {
  const data = req.body; // 클라이언트에서 보낸 데이터

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db(databaseName);
    const collection = database.collection(collectionName);

    const result = await collection.insertOne(data);
    console.log('Data inserted into MongoDB:', result.insertedId);

    res.json({ success: true, message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data into MongoDB:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    await client.close();
    console.log('Connection to MongoDB closed');
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

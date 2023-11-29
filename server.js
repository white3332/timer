const express = require('express');
const app = express();

app.use(express.static(__dirname)); // 현재 디렉토리를 정적 파일로 서빙

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});


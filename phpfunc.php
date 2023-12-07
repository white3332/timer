<?php
$host = '192.168.146.100';
$user = 'white3332';
$password = 'white3332';
$database = 'times';

// MySQL 연결 설정
$connection = new mysqli($host, $user, $password, $database);

if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

// CORS 허용 설정
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

// JSON 데이터 파싱
$data = json_decode(file_get_contents('php://input'), true);
error_log("Received data: " . print_r($data, true));

// ID로 검색하여 times 반환하는 API
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    $userId = $_GET['id'];
    $query = "SELECT times FROM times WHERE id = ?";
    $statement = $connection->prepare($query);

    if (!$statement) {
        die("Error preparing statement: " . $connection->error);
    }

    $statement->bind_param("s", $userId);
    $statement->execute();
    $result = $statement->get_result();

    if (!$result) {
        die("Error executing query: " . $statement->error);
    }

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $times = json_decode($row['times'], true);
        echo json_encode($times);
    } else {
        // 존재하지 않는 아이디를 조회한 경우
        http_response_code(404);
        echo '입력하신 아이디가 존재하지 않습니다.';
    }

    $statement->close();
}

// ID와 times를 받아서 데이터베이스에 저장하는 API
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($data['id']) && isset($data['times'])) {
    $id = substr($data['id'], 0, 500); // Limit the id to 500 characters
    $times = json_encode($data['times']);
    
    if (strlen($id) > 500 || strlen($times) > 500) {
        die("Error: ID or times exceeds the maximum length.");
    }

    $query = "
        INSERT INTO times (id, times) 
        VALUES (?, ?) 
        ON DUPLICATE KEY UPDATE times = VALUES(times)
    ";

    $statement = $connection->prepare($query);

    if (!$statement) {
        die("Error preparing statement: " . $connection->error);
    }

    $statement->bind_param("ss", $id, $times);
    $statement->execute();

    if ($statement->error) {
        die("Error executing query: " . $statement->error);
    }

    echo 'Data saved successfully';
    $statement->close();
}

$connection->close();
?>

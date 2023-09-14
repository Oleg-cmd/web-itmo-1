<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_SESSION['results'])) {
        $_SESSION['results'] = [];
        http_response_code(200); // "OK"
        echo "Данные успешно очищены.";
    } else {
        http_response_code(200); // "Not Found"
        echo "Данные не найдены.";
    }
} else {
    http_response_code(405); // "Method Not Allowed"
    echo "Метод не разрешен.";
}
?>
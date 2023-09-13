<?php

session_start();

function validateData($x, $y, $r) {
    if (
        is_numeric($x) && is_numeric($y) && is_numeric($r) &&
        ($x > -5 && $x < 3) &&
        ($y >= -4 && $y <= 4) &&
        ($r >= 1 && $r <= 3)
    ) {
        return true;
    } else {
        return false;
    }
}

function checkHit($x, $y, $r) {
    if (
        // квадрат
        ($x <= $r && $x >= 0 && $y >= 0 && $y <= $r) ||
        // прямоугольный треугольник
        ($x <= $r / 2 && $x >= 0 && $y >= -$r && $y <= 0 && $x <= ($y + $r) / 2) ||
        // четверть сферы
        ($x >= -$r / 2 && $x <= 0 && $y >= -$r / 2 && $y <= 0 && ($x ** 2 + $y ** 2) <= ($r / 2) ** 2)
    ) {
        return "Попадание";
    } else {
        return "Промах";
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $requestData = json_decode(file_get_contents('php://input'), true);

    $x = floatval($requestData['x']);
    $y = floatval($requestData['y']);
    $r = floatval($requestData['r']);

    if (validateData($x, $y, $r)) {
        $result = checkHit($x, $y, $r);
        $serverTime = date('Y-m-d H:i:s T'); // Формат времени (год-месяц-день час:минута:секунда часовой_пояс)

         // Вычисляем execution time
        $startTimestamp = $_SESSION['startTimestamp'];
        $endTimestamp = time();
        $executionTime = ($endTimestamp - $startTimestamp) * 1000; // в миллисекундах

        $response = [
            'result' => $result,
            'serverTime' => $serverTime,
            'executionTime' => $executionTime,
        ];

        header('Content-Type: application/json');
        echo json_encode($response);
    } else {
        http_response_code(400); // "Bad Request"
        $result = "Неверные значения. Пожалуйста, убедитесь, что x в диапазоне [-5, 3], y в диапазоне [-4, 4] и r в диапазоне [1, 3].";

        $response = [
            'result' => $result,
            'serverTime' => null,
            'executionTime' => null,
        ];
        header('Content-Type: application/json');
        echo json_encode($response);
    }
} else {
    http_response_code(405); // "Method Not Allowed"
    echo "Метод не разрешен.";
}
?>

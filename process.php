<?php

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

$start_time = microtime(true);

function validateData($x, $y, $r)
{
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

function checkHit($x, $y, $r)
{
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

function checkLength($x, $y, $r)
{
    if (strlen($x) <= 15 && strlen($y) <= 15 && strlen($r)) {
        return true;
    }
    return false;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $requestData = json_decode(file_get_contents('php://input'), true);
    if (!checkLength($requestData['x'], $requestData['y'], $requestData['z'])) {
        http_response_code(400); // "Bad Request"
        $result = "Неверные значения. Превышен диапазон длинны допустимого значения";
        $response = [
            'x' => $x,
            'y' => $y,
            'r' => $r,
            'result' => $result,
            'serverTime' => null,
            'executionTime' => null,
        ];
        header('Content-Type: application/json');
        echo json_encode($response);
    } else {
        $x = floatval($requestData['x']);
        $y = floatval($requestData['y']);
        $r = floatval($requestData['r']);

        if (validateData($x, $y, $r)) {
            $result = checkHit($x, $y, $r);
            $serverTime = date('Y-m-d H:i:s T'); // Формат времени (год-месяц-день час:минута:секунда часовой_пояс)

            // Вычисляем execution time
            $endTimestamp = microtime(true); // Записываем метку времени в конце выполнения скрипта
            $executionTime = number_format(($endTimestamp - $start_time) * 1000, 5); // в миллисекундах

            $response = [
                'x' => $x,
                'y' => $y,
                'r' => $r,
                'result' => $result,
                'serverTime' => $serverTime,
                'executionTime' => $executionTime,
            ];

            $_SESSION['results'][] = [
                'x' => $x,
                'y' => $y,
                'r' => $r,
                'result' => $result,
                'serverTime' => $serverTime,
                'executionTime' => $executionTime,
            ];

            header('Content-Type: application/json');
            http_response_code(200); // "OK"
            echo json_encode($response);
        } else {
            http_response_code(400); // "Bad Request"
            $result = "Неверные значения. Пожалуйста, убедитесь, что x в диапазоне [-5, 3], y в диапазоне [-4, 4] и r в диапазоне [1, 3].";

            $response = [
                'x' => $x,
                'y' => $y,
                'r' => $r,
                'result' => $result,
                'serverTime' => null,
                'executionTime' => null,
            ];
            header('Content-Type: application/json');
            echo json_encode($response);
        }
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_SESSION['results']) && !empty($_SESSION['results'])) {
        header('Content-Type: application/json');
        echo json_encode($_SESSION['results']);
    } else {
        echo "Нет результатов для отображения.";
    }
} else {
    http_response_code(405); // "Method Not Allowed"
    echo "Метод не разрешен.";
}


?>
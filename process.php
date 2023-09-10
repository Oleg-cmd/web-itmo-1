<?php
// Получаем данные
$x = floatval($_POST['x']);
$y = floatval($_POST['y']);
$r = floatval($_POST['r']);

if (   
    ($x >= -5 && $x <= 3) &&
    ($y >= -4 && $y <= 4) &&
    ($r >= 1 && $r <= 3)
) {
    // Проверка попадания в фигуры
    if (
        // Проверка попадания в квадрат
        ($x <= $r && $x >= 0 && $y >= 0 && $y <= $r) ||
        // Проверка попадания в прямоугольный треугольник
        ($x <= $r / 2 && $x >= 0 && $y >= -$r && $y <= 0 && $x <= ($y + $r) / 2) ||
        // Проверка попадания в четверть сферы
        ($x >= -$r / 2 && $x <= 0 && $y >= -$r / 2 && $y <= 0 && ($x ** 2 + $y ** 2) <= ($r / 2) ** 2)
    ) {
        $result = "Попадание";
    } else {
        $result = "Промах";
    }
} else {
    // Значения не соответствуют диапазонам
    http_response_code(400); // "Bad Request"
    $result = "Неверные значения. Пожалуйста, убедитесь, что x в диапазоне [-5, 3], y в диапазоне [-4, 4] и r в диапазоне [1, 3].";
}

echo json_encode(['result' => $result]);

?>

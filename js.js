document.addEventListener('DOMContentLoaded', function () {
    var yButtons = document.querySelectorAll(".y-btns input[type='button']")
    var rButtons = document.querySelectorAll(".r-btns input[type='button']")

    // Загрузка ранее сохраненных данных при загрузке страницы
    loadSavedData();

    yButtons.forEach(function (button) {
        button.addEventListener('click', function () {           
            yButtons.forEach(function (btn) {
                btn.classList.remove('selected')
            })

            button.classList.add('selected')
        })
    })

    rButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            rButtons.forEach(function (btn) {
                btn.classList.remove('selected')
            })

            button.classList.add('selected')
        })
    })
})

document.addEventListener('DOMContentLoaded', function () {
    var submitButton = document.getElementById('submit-button')
    var resultTable = document.querySelector('.result-table');

    submitButton.addEventListener('click', function () {
        var selectedY = document.querySelector(
            '.y-btns input[type="button"].selected',
        )
        var selectedR = document.querySelector(
            '.r-btns input[type="button"].selected',
        )

        var xInput = document.getElementById('x-input')

        
        if (!selectedY) {
            alert('Выберите значение Y.')
            return // Останавливаем отправку формы
        }

       
        if (!selectedR) {
            alert('Выберите значение R.')
            return // Останавливаем отправку формы
        }

        
        var xValue = parseFloat(xInput.value)

        if (isNaN(xValue) || xValue >= 3 || xValue <= -5) {
            alert('Введите корректное значение X в диапазоне от -5 до 3. (не включительно)')
            return // Останавливаем отправку формы
        }

        var formData = new FormData()
        formData.append('x', xValue)
        formData.append('y', selectedY.value)
        formData.append('r', selectedR.value)

        console.log(formData)

        // Измеряем время начала выполнения
        var startTime = performance.now()

        // Отправляем запрос на сервер
        var xhr = new XMLHttpRequest()
        xhr.open('POST', 'process.php', true)
        
        xhr.onload = function () {
            if (xhr.status === 200) {
                // Обрабатываем ответ от сервера
                var response = JSON.parse(xhr.responseText)
                
                var endTime = performance.now()
                var executionTime = endTime - startTime

                var newRow = document.createElement('div')
                newRow.classList.add('row')
                
                newRow.innerHTML = `
                    <div class="x">${xValue}</div>
                    <div class="y">${selectedY.value}</div>
                    <div class="r">${selectedR.value}</div>
                    <div class="ct">${getCurrentTime()}</div>
                    <div class="et">${executionTime} ms</div>
                    <div class="result">${response.result}</div>
                `


                resultTable.appendChild(newRow)
               // Сохранение данных в куки
                saveDataToCookie({
                    x: xValue,
                    y: selectedY.value,
                    r: selectedR.value,
                    currentTime: getCurrentTime(),
                    executionTime: executionTime,
                    result: response.result
                });

               
            } else {
                alert('Ошибка при отправке данных на сервер.')
            }
        }

        xhr.send(formData)
    })
})

function getCurrentTime() {
    var now = new Date();
    var hours = now.getHours().toString().padStart(2, '0');
    var minutes = now.getMinutes().toString().padStart(2, '0');
    var seconds = now.getSeconds().toString().padStart(2, '0');
    return hours + ':' + minutes + ':' + seconds;
}

var clearButton = document.querySelector('.main-btns div div:last-child');

clearButton.addEventListener('click', function () {
    var resultTable = document.querySelector('.result-table');
    var firstRow = resultTable.querySelector('.row');
    // Удаляем все строки, начиная с второй
    while (resultTable.children.length > 1) {
        resultTable.removeChild(resultTable.children[1]);
    }

    // Очистка куков с именем 'savedData'
    clearCookie('savedData');
});

// Функция для очистки куки по имени
function clearCookie(name) {
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
}

function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}


function getCookie(name) {
    const cookieValue = document.cookie.match(`(^|;)\\s*${name}=([^;]+)`);
    return cookieValue ? cookieValue.pop() : '';
}

function loadSavedData() {
    const savedDataJSON = getCookie('savedData');
    if (savedDataJSON) {
        const savedDataArray = JSON.parse(savedDataJSON);
        savedDataArray.forEach(function (savedData) {
            var newRow = document.createElement('div')
            newRow.classList.add('row')

            newRow.innerHTML = `
                <div class="x">${savedData.x}</div>
                <div class="y">${savedData.y}</div>
                <div class="r">${savedData.r}</div>
                <div class="ct">${savedData.currentTime}</div>
                <div class="et">${savedData.executionTime} ms</div>
                <div class="result">${savedData.result}</div>
            `
            var resultTable = document.querySelector('.result-table');
            resultTable.appendChild(newRow);
        });
    }
}

function saveDataToCookie(data) {
    const savedDataJSON = getCookie('savedData');
    let savedDataArray = [];
    if (savedDataJSON) {
        savedDataArray = JSON.parse(savedDataJSON);
    }
    savedDataArray.push(data);
    const dataJSON = JSON.stringify(savedDataArray);
    setCookie('savedData', dataJSON, 365);
}
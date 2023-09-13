document.addEventListener('DOMContentLoaded', function () {
    let yButtons = document.querySelectorAll(".y-btns input[type='button']")
    let rButtons = document.querySelectorAll(".r-btns input[type='button']")

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
    let submitButton = document.getElementById('submit-button')
    let resultTable = document.querySelector('.result-table');

    submitButton.addEventListener('click', function () {
        let selectedY = document.querySelector(
            '.y-btns input[type="button"].selected',
        )
        let selectedR = document.querySelector(
            '.r-btns input[type="button"].selected',
        )

        let xInput = document.getElementById('x-input')

        if (!selectedY) {
            showCustomAlert('Выберите значение Y.')
            return // Останавливаем отправку формы
        }

        if (!selectedR) {
            showCustomAlert('Выберите значение R.')
            return // Останавливаем отправку формы
        }

        let xValue = parseFloat(xInput.value)

        if (isNaN(xValue) || xValue >= 3 || xValue <= -5) {
            showCustomAlert('Введите корректное значение X в диапазоне от -5 до 3. (не включительно)')
            return // Останавливаем отправку формы
        }

        let formData = new FormData()
        formData.append('x', xValue)
        formData.append('y', selectedY.value)
        formData.append('r', selectedR.value)

        console.log(formData)

        // Отправляем запрос на сервер
        let xhr = new XMLHttpRequest()
        xhr.open('POST', 'process.php', true)
        xhr.setRequestHeader('Content-Type', 'application/json'); // Устанавливаем заголовок Content-Type
        xhr.setRequestHeader('Accept', 'application/json'); // Устанавливаем заголовок Accept

        xhr.onload = function () {
            if (xhr.status === 200) {
                // Обрабатываем ответ от сервера
                let response = JSON.parse(xhr.responseText)

                let newRow = document.createElement('div')
                newRow.classList.add('row')

                newRow.innerHTML = `
                    <div class="x">${xValue}</div>
                    <div class="y">${selectedY.value}</div>
                    <div class="r">${selectedR.value}</div>
                    <div class="ct">${response.serverTime}</div>
                    <div class="et">${response.executionTime} ms</div>
                    <div class="result">${response.result}</div>
                `

                resultTable.appendChild(newRow)
            } else {
                showCustomAlert('Ошибка при отправке данных на сервер.')
            }
        }

        xhr.send(formData)
    })
})

let clearButton = document.querySelector('.main-btns div div:last-child');

clearButton.addEventListener('click', function () {
    let resultTable = document.querySelector('.result-table');
    let firstRow = resultTable.querySelector('.row');
    // Удаляем все строки, начиная с второй
    while (resultTable.children.length > 1) {
        resultTable.removeChild(resultTable.children[1]);
    }
});

function showCustomAlert(message) {
    const customAlert = document.querySelector('.custom-alert');
    customAlert.textContent = message;
    customAlert.style.opacity = '1';

    setTimeout(() => {
        customAlert.style.opacity = '0';
    }, 10000); 
}

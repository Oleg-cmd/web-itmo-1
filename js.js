function updateData() {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "process.php", true);

  xhr.onload = function () {
    if (xhr.status === 200) {
      let responseText = xhr.responseText.trim(); // Убираем пробельные символы
      if (responseText) {
        try {
          let response = JSON.parse(responseText);
          if (response) {
            let resultTable = document.querySelector(".result-table");
    
            for (let i = 0; i < response.length; i++) {
              let newRow = document.createElement("div");
    
              newRow.classList.add("row");

              let myTime = new Date(response[i].serverTime*1000).toLocaleTimeString();
    
              newRow.innerHTML = `
                            <div class="x">${response[i].x}</div>
                            <div class="y">${response[i].y}</div>
                            <div class="r">${response[i].r}</div>
                            <div class="ct">${myTime}</div>
                            <div class="et">${response[i].executionTime} ms</div>
                            <div class="result">${response[i].result}</div>
                        `;
    
              let firstDataRow = resultTable.querySelector(".row:not(.head)");
              if (firstDataRow) {
                resultTable.insertBefore(newRow, firstDataRow);
              } else {
                resultTable.appendChild(newRow);
              }
            }
          }
        } catch (e) {
          console.warn("Ошибка при парсинге JSON:", e);
        }
      } else {
        console.warn("Пустой ответ от сервера.");
      }
    }
  }

  xhr.send();
}



document.addEventListener("DOMContentLoaded", function () {
  updateData();
});

window.addEventListener("beforeunload", function () {
  updateData();
});

document.addEventListener("DOMContentLoaded", function () {
  let yButtons = document.querySelectorAll(".y-btns input[type='button']");
  let rButtons = document.querySelectorAll(".r-btns input[type='button']");

  yButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      yButtons.forEach(function (btn) {
        btn.classList.remove("selected");
      });

      button.classList.add("selected");
    });
  });

  rButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      rButtons.forEach(function (btn) {
        btn.classList.remove("selected");
      });

      button.classList.add("selected");
    });
  });
});

document.addEventListener("input", function(){
  let xInput = document.getElementById("x-input");
  const regex = /^-?\d*\.?\d+$/; // check dec
    let xValue = xInput.value.replace(',', '.');
    if (!regex.test(xValue)){
      showCustomAlert(
        "Введенное значение X не является десятичным числом"
      );
      return; // Останавливаем отправку формы
    }
    if (isNaN(xValue) || parseFloat(xValue) >= 3 || parseFloat(xValue) <= -5) {
      showCustomAlert(
        "Введите корректное значение X в диапазоне от -5 до 3. (не включительно)"
      );
      return; // Останавливаем отправку формы
    }else{
      hideCustomAlert()
    }
})

document.addEventListener("DOMContentLoaded", function () {
  let submitButton = document.getElementById("submit-button");
  let resultTable = document.querySelector(".result-table");

  submitButton.addEventListener("click", function () {
    let selectedY = document.querySelector(
      '.y-btns input[type="button"].selected'
    );
    let selectedR = document.querySelector(
      '.r-btns input[type="button"].selected'
    );

    let xInput = document.getElementById("x-input");

    if (!selectedY) {
      showCustomAlert("Выберите значение Y.");
      return; // Останавливаем отправку формы
    }

    if (!selectedR) {
      showCustomAlert("Выберите значение R.");
      return; // Останавливаем отправку формы
    }
    const regex = /^-?\d*\.?\d+$/; // check dec
    let xValue = xInput.value.replace(',', '.');

    if (!regex.test(xValue)){
      showCustomAlert(
        "Введенное значение X не является десятичным числом"
      );
      return; // Останавливаем отправку формы
    }

    if (isNaN(xValue) || parseFloat(xValue) >= 3 || parseFloat(xValue) <= -5) {
      showCustomAlert(
        "Введите корректное значение X в диапазоне от -5 до 3. (не включительно)"
      );
      return; // Останавливаем отправку формы
    }

    let data = {
      x: xValue,
      y: selectedY.value,
      r: selectedR.value,
    };

    // Отправляем запрос на сервер
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "process.php", true);
    xhr.setRequestHeader("Content-Type", "application/json"); 
    xhr.setRequestHeader("Accept", "application/json");

    xhr.onload = function () {
      if (xhr.status === 200) {
        // Обрабатываем ответ от сервера
        let response = JSON.parse(xhr.responseText);

        let newRow = document.createElement("div");
        newRow.classList.add("row");

        let date = new Date(response.serverTime*1000).toLocaleTimeString();

        newRow.innerHTML = `
                    <div class="x">${response.x}</div>
                    <div class="y">${response.y}</div>
                    <div class="r">${response.r}</div>
                    <div class="ct">${date}</div>
                    <div class="et">${response.executionTime} ms</div>
                    <div class="result">${response.result}</div>
                `;

                let firstDataRow = resultTable.querySelector(".row:not(.head)");
        resultTable.insertBefore(newRow, firstDataRow);
      } else {
        showCustomAlert("Ошибка при отправке данных на сервер.");
      }
    };

    xhr.send(JSON.stringify(data));
  });
});

let clearButton = document.getElementById("clearButton");

clearButton.addEventListener("click", function () {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "clear.php", true);

  xhr.onload = function () {
    if (xhr.status === 200) {
      let resultTable = document.querySelector(".result-table");
      while (resultTable.children.length > 1) {
        resultTable.removeChild(resultTable.children[1]);
      }
    }
  };

  xhr.send();
});

function showCustomAlert(message) {
  const customAlert = document.querySelector(".custom-alert");
  customAlert.textContent = message;
  customAlert.style.opacity = "1";

  setTimeout(() => {
    customAlert.style.opacity = "0";
  }, 1000);
}

function hideCustomAlert() {
  const customAlert = document.querySelector(".custom-alert");
  customAlert.textContent = message;
  customAlert.style.opacity = "0";
}


function isFormValid() {
  const xInput = document.getElementById("x-input");
  const selectedY = document.querySelector('.y-btns input[type="button"].selected');
  const selectedR = document.querySelector('.r-btns input[type="button"].selected');

  return xInput.value.trim() !== "" && selectedY && selectedR;
}


function updateSubmitButton() {
  const submitButton = document.getElementById("submit-button");
  const isFormValidFlag = isFormValid();

  submitButton.disabled = !isFormValidFlag;

  if (isFormValidFlag) {
    submitButton.style.opacity = 1;
  } else {
    submitButton.style.opacity = 0.5;
  }
}

// Добавляем слушатель на изменения в полях и кнопках Y и R
document.addEventListener("DOMContentLoaded", function () {
  const xInput = document.getElementById("x-input");
  const yButtons = document.querySelectorAll(".y-btns input[type='button']");
  const rButtons = document.querySelectorAll(".r-btns input[type='button']");

  xInput.addEventListener("input", updateSubmitButton);
  yButtons.forEach((button) => {
    button.addEventListener("click", updateSubmitButton);
  });
  rButtons.forEach((button) => {
    button.addEventListener("click", updateSubmitButton);
  });

  updateSubmitButton();
});


// При загрузке страницы
document.addEventListener("DOMContentLoaded", function () {
  // Загрузка состояния кнопок из localStorage
  let savedY = localStorage.getItem('selectedY');
  let savedR = localStorage.getItem('selectedR');
  if (savedY) {
      document.querySelector(`.y-btns input[value="${savedY}"]`).classList.add("selected");
  }
  if (savedR) {
      document.querySelector(`.r-btns input[value="${savedR}"]`).classList.add("selected");
  }

  // Сохранение состояния кнопок в localStorage при клике
  let yButtons = document.querySelectorAll(".y-btns input[type='button']");
  let rButtons = document.querySelectorAll(".r-btns input[type='button']");

  yButtons.forEach(function (button) {
      button.addEventListener("click", function () {
          localStorage.setItem('selectedY', button.value);
      });
  });

  rButtons.forEach(function (button) {
      button.addEventListener("click", function () {
          localStorage.setItem('selectedR', button.value);
      });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  loadStateFromLocalStorage();
});

document.addEventListener("click", function (event) {
  const target = event.target;

  // Проверяем, что клик не был на кнопке и не в поле ввода X
  if (
    !target.matches(".y-btns input[type='button']") &&
    !target.matches(".r-btns input[type='button']") &&
    !target.matches("#x-input") &&
    !target.matches(".result-table") &&
    !target.matches(".main-container") &&
    !target.matches(".main-btns")
  ) {
    // Убираем класс .selected у всех кнопок
    document
      .querySelectorAll(".y-btns input[type='button'], .r-btns input[type='button']")
      .forEach(function (button) {
        button.classList.remove("selected");
      });

    localStorage.removeItem("selectedY")
    localStorage.removeItem("selectedR")
  }
});

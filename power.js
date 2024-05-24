document.addEventListener("DOMContentLoaded", function () {
  // Проверка, запущен ли сайт внутри Telegram WebApp
  if (!window.Telegram || !window.Telegram.WebApp) {
    document.body.innerHTML =
      "<h1>Этот сайт доступен только в Telegram Mini Apps</h1>";
    return;
  }

  // Инициализация Telegram WebApp
  Telegram.WebApp.ready();
  Telegram.WebApp.expand();

  // Отключение контекстного меню
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });

  // Отключение клавиш F12 и других комбинаций для открытия консоли
  document.addEventListener("keydown", function (e) {
    if (
      e.key === "F12" ||
      (e.ctrlKey &&
        e.shiftKey &&
        (e.key === "I" || e.key === "J" || e.key === "C")) ||
      (e.ctrlKey && e.key === "U") ||
      (e.metaKey && e.altKey && e.key === "I")
    ) {
      // Option+Command+I on Mac
      e.preventDefault();
    }
  });

  // Определение мобильного устройства
  function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
  }

  // Обнаружение инструментов разработчика и перенаправление
  function detectDevTools() {
    if (isMobileDevice()) {
      return; // Не выполнять проверку на мобильных устройствах
    }

    var threshold = 200; // Пороговое значение для определения открытия инструментов разработчика
    if (
      window.outerHeight - window.innerHeight > threshold ||
      window.outerWidth - window.innerWidth > threshold
    ) {
      // Перенаправление на другой сайт
      window.location.href = "https://mrbeast.store/"; // Замените URL на нужный вам сайт
    }
  }

  window.addEventListener("resize", detectDevTools);
  setInterval(detectDevTools, 1000);
});

document.addEventListener("DOMContentLoaded", function () {
  var balance = parseInt(localStorage.getItem("balance")) || 0; // Получаем баланс из localStorage
  document.getElementById("balance").textContent = balance; // Обновляем текст в элементе баланса

  // Обработчик клика для кнопки "Energy tap"
  document
    .getElementById("first-button")
    .addEventListener("click", function () {
      if (balance >= 2500) {
        balance -= 2500; // Уменьшаем баланс
        localStorage.setItem("balance", balance.toString()); // Сохраняем новый баланс в localStorage
        localStorage.setItem("clicksCount", "0"); // Сбрасываем количество кликов
        localStorage.removeItem("recoveryStart"); // Убираем таймер восстановления, если он был

        // Вибрация при успешной покупке
        if (window.Telegram && window.Telegram.WebApp) {
          window.Telegram.WebApp.HapticFeedback.impactOccurred("medium");
        }

        // Перенаправляем на index.html
        window.location.href = "index.html";
      } else {
        showAlert("Not enough coins");
      }
    });

  // Обработчик клика для кнопки "Multitap"
  document
    .getElementById("second-button")
    .addEventListener("click", function () {
      var multitapCost = parseInt(localStorage.getItem("multitapCost")) || 20; // Начальная стоимость
      var multiplier = parseInt(localStorage.getItem("multiplier")) || 1;

      if (balance >= multitapCost) {
        balance -= multitapCost;
        localStorage.setItem("balance", balance.toString());

        multiplier++; // Увеличиваем множитель
        localStorage.setItem("multiplier", multiplier.toString());

        multitapCost *= 2; // Удваиваем стоимость для следующей покупки
        localStorage.setItem("multitapCost", multitapCost.toString());
        document.getElementById("multitap-cost").textContent = multitapCost; // Обновляем стоимость на странице

        // Вибрация при успешной покупке
        if (window.Telegram && window.Telegram.WebApp) {
          window.Telegram.WebApp.HapticFeedback.impactOccurred("medium");
        }

        window.location.href = "index.html";
      } else {
        showAlert("Not enough coins");
      }
    });

  // Обработчик клика для кнопки "Beast rocket"
  document
    .getElementById("third-button")
    .addEventListener("click", function () {
      if (balance >= 50000) {
        balance -= 50000; // Списание с баланса
        localStorage.setItem("balance", balance.toString()); // Сохранение нового значения баланса
        localStorage.setItem("rocketPurchased", "true"); // Флаг о покупке ракеты

        // Вибрация при успешной покупке
        if (window.Telegram && window.Telegram.WebApp) {
          window.Telegram.WebApp.HapticFeedback.impactOccurred("medium");
        }

        window.location.href = "index.html"; // Переход на главную страницу
      } else {
        showAlert("Not enough coins"); // Показываем уведомление, если недостаточно монет
      }
    });

  // Обработчик клика для кнопки "Back"
  document.querySelector(".back-button").addEventListener("click", function () {
    // Вибрация при нажатии
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred("medium");
    }

    window.location.href = "index.html";
  });

  // Обновляем отображаемую стоимость при загрузке страницы
  var multitapCost = localStorage.getItem("multitapCost") || "20";
  document.getElementById("multitap-cost").textContent = multitapCost;

  function showAlert(message) {
    var canvas = document.getElementById("alertCanvas");
    var ctx = canvas.getContext("2d");
    canvas.style.display = "block";
    var width = canvas.width;
    var height = canvas.height;

    var particles = [];
    var particleCount = 50;
    for (var i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`,
      });
    }

    var opacity = 0;
    var interval = setInterval(function () {
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.font = "24px Arial";
      ctx.textAlign = "center";
      ctx.fillText(message, width / 2, height / 2);

      particles.forEach((particle) => {
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > height) particle.speedY *= -1;
      });

      opacity += 0.05;
      if (opacity >= 1) clearInterval(interval);
    }, 50);

    setTimeout(function () {
      var fadeOut = setInterval(function () {
        opacity -= 0.05;
        if (opacity <= 0) {
          clearInterval(fadeOut);
          canvas.style.display = "none";
          ctx.clearRect(0, 0, width, height);
        }
      }, 50);
    }, 2000);
  }
});

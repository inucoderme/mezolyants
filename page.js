document.addEventListener("DOMContentLoaded", function () {
  const button = document.querySelector(".join-button");

  button.addEventListener("click", function () {
    // Запуск эффекта конфетти
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Изменение текста на кнопке на "Done"
    button.textContent = "Expect 🙊";

    // Использование Haptic Feedback через Telegram Mini Apps
    if (Telegram.WebApp.MainButton) {
      Telegram.WebApp.MainButton.showProgress();
      setTimeout(() => {
        Telegram.WebApp.MainButton.hideProgress();
      }, 200);
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Prevent context menu
  document.addEventListener("contextmenu", (event) => event.preventDefault());

  // Prevent opening developer tools with F12 or Ctrl+Shift+I
  document.addEventListener("keydown", (event) => {
    if (
      (event.ctrlKey && event.shiftKey && event.key === "I") ||
      (event.ctrlKey && event.shiftKey && event.key === "J") ||
      (event.ctrlKey && event.key === "U") ||
      event.key === "F12"
    ) {
      event.preventDefault();
    }
  });

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

  const balanceElement = document.querySelector(".balance-leaders");

  // Use a fixed base time for consistency across all users
  const baseTime = new Date("2024-05-19T00:00:00Z").getTime();
  let lastUpdate = localStorage.getItem("lastUpdate");
  let currentBalance = localStorage.getItem("currentBalance");

  if (!lastUpdate || !currentBalance) {
    lastUpdate = baseTime; // Set initial time to base time
    currentBalance = calculateInitialBalance();
    localStorage.setItem("lastUpdate", lastUpdate);
    localStorage.setItem("currentBalance", currentBalance);
  } else {
    lastUpdate = parseInt(lastUpdate, 10);
    currentBalance = parseInt(currentBalance, 10);
  }

  function getRandomIncrement(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function calculateInitialBalance() {
    const now = new Date().getTime();
    const timeDiff = now - baseTime;
    const incrementsCount = Math.floor(timeDiff / 2000);
    let balance = 0;
    for (let i = 0; i < incrementsCount; i++) {
      balance += getRandomIncrement(100, 500) - getRandomIncrement(100, 200);
    }
    return balance;
  }

  function calculateBalance() {
    const now = new Date().getTime();
    const timeDiff = now - lastUpdate;
    const incrementsCount = Math.floor(timeDiff / 2000);
    let balanceChange = 0;
    for (let i = 0; i < incrementsCount; i++) {
      balanceChange +=
        getRandomIncrement(100, 500) - getRandomIncrement(100, 200);
    }
    lastUpdate = now; // Update the last update time
    localStorage.setItem("lastUpdate", lastUpdate);
    return balanceChange;
  }

  function updateBalance() {
    const balanceChange = calculateBalance();
    currentBalance += balanceChange;
    balanceElement.textContent = currentBalance
      .toLocaleString("ru-RU", { useGrouping: true, minimumFractionDigits: 0 })
      .replace(/,/g, ".");
    localStorage.setItem("currentBalance", currentBalance);
  }

  setInterval(updateBalance, 2000);
});

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
      window.location.href = "https://example.com"; // Замените URL на нужный вам сайт
    }
  }

  window.addEventListener("resize", detectDevTools);
  setInterval(detectDevTools, 1000);

  // Инициализация кнопки и Haptic Feedback
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
      Telegram.WebApp.HapticFeedback.impactOccurred("heavy");
      Telegram.WebApp.MainButton.showProgress();
      setTimeout(() => {
        Telegram.WebApp.MainButton.hideProgress();
      }, 200);
    } else {
      console.error("Telegram WebApp MainButton не поддерживается на этом устройстве.");
    }
  });
});

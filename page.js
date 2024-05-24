document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed");

  const button = document.querySelector(".join-button");

  if (!button) {
    console.error("Button with class 'join-button' not found.");
    return;
  }

  // Проверка, запущен ли сайт внутри Telegram WebApp
  if (!window.Telegram || !window.Telegram.WebApp) {
    document.body.innerHTML =
      "<h1>Этот сайт доступен только в Telegram Mini Apps</h1>";
    return;
  }

  // Инициализация Telegram WebApp
  Telegram.WebApp.ready();
  Telegram.WebApp.expand();

  // Показать MainButton
  Telegram.WebApp.MainButton.setText("Join");
  Telegram.WebApp.MainButton.show();

  // Добавляем обработчик клика на кнопку
  button.addEventListener("click", function () {
    console.log("Button clicked");

    // Запуск эффекта конфетти
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Изменение текста на кнопке на "Expect 🙊"
    button.textContent = "Expect 🙊";

    // Отладочные сообщения
    console.log("Attempting to show progress on MainButton...");

    // Использование Haptic Feedback через Telegram Mini Apps
    if (Telegram.WebApp.HapticFeedback) {
      try {
        Telegram.WebApp.HapticFeedback.impactOccurred("medium");
        console.log("Haptic Feedback triggered.");
      } catch (error) {
        console.error("Error triggering Haptic Feedback:", error);
      }
    } else {
      console.error("HapticFeedback is not available.");
    }

    // Использование MainButton прогресса
    if (Telegram.WebApp.MainButton) {
      Telegram.WebApp.MainButton.showProgress();
      console.log("Progress shown on MainButton.");

      setTimeout(() => {
        Telegram.WebApp.MainButton.hideProgress();
        console.log("Progress hidden on MainButton.");
      }, 200);
    } else {
      console.error("Telegram.WebApp.MainButton is not available.");
    }
  });
});

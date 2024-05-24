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

  const button = document.querySelector(".join-button");

  if (button) {
    button.addEventListener("click", function () {
      // Запуск эффекта конфетти
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Изменение текста на кнопке на "Expect 🙊"
      button.textContent = "Expect 🙊";

      // Использование Haptic Feedback через Telegram Mini Apps
      if (Telegram.WebApp.HapticFeedback) {
        Telegram.WebApp.HapticFeedback.impactOccurred("heavy");
      } else {
        console.error("HapticFeedback не поддерживается на этом устройстве.");
      }

      // Показываем прогресс на MainButton
      if (Telegram.WebApp.MainButton) {
        Telegram.WebApp.MainButton.showProgress();
        setTimeout(() => {
          Telegram.WebApp.MainButton.hideProgress();
        }, 200);
      } else {
        console.error("MainButton не поддерживается на этом устройстве.");
      }
    });
  } else {
    console.error(".join-button не найден.");
  }
});

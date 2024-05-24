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

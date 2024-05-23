document.addEventListener('DOMContentLoaded', function () {
  const button = document.querySelector('.join-button');

  function triggerHapticFeedback() {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred("medium");
    }
  }

  button.addEventListener('click', function() {
    // Запуск эффекта конфетти
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Изменение текста на кнопке на "Done"
    button.textContent = "Done";

    // Активация тактильного отклика
    triggerHapticFeedback();
  });
});

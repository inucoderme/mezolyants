document.getElementById("claim-button").addEventListener("click", function () {
  // Запуск конфетти
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });

  // Haptic Feedback
  if (
    typeof Telegram !== "undefined" &&
    Telegram.WebApp &&
    Telegram.WebApp.HapticFeedback
  ) {
    Telegram.WebApp.HapticFeedback.impactOccurred("medium");
  }
});

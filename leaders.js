document.addEventListener("DOMContentLoaded", function () {
  const balanceElement = document.querySelector(".balance-leaders");
  const logElement = document.createElement("div");
  document.body.appendChild(logElement);

  const baseTime = new Date("2024-05-19T00:00:00Z").getTime();
  let lastUpdate = parseInt(localStorage.getItem("lastUpdate"), 10);
  let currentBalance = parseInt(localStorage.getItem("currentBalance"), 10);

  if (!lastUpdate || !currentBalance) {
    lastUpdate = baseTime; // Устанавливаем начальное время как базовое время
    currentBalance = calculateInitialBalance();
    localStorage.setItem("lastUpdate", lastUpdate);
    localStorage.setItem("currentBalance", currentBalance);
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
    lastUpdate = now; // Обновляем последнее время обновления
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

  // Функционал для нескольких блоков
  const blockCount = 5;
  for (let i = 1; i <= blockCount; i++) {
    setupBlock(i);
  }

  function setupBlock(suffix) {
    const clickableContainer = document.getElementById(
      `clickable-container-${suffix}`
    );
    const containerWithButton = document.getElementById(
      `container-with-button-${suffix}`
    );
    const actionButton = document.getElementById(`action-button-${suffix}`);

    // Проверка состояния точки и текста кнопки при загрузке
    if (localStorage.getItem(`dotVisible-${suffix}`) === "true") {
      addBlinkingDot(suffix);
    }
    if (localStorage.getItem(`buttonText-${suffix}`) === "Done") {
      actionButton.textContent = "Done 👍";
    }

    clickableContainer.addEventListener("click", function () {
      toggleCollapsible(containerWithButton);
    });

    actionButton.addEventListener("click", function () {
      hapticFeedback(); // Добавляем тактильную обратную связь
      resetOtherBlocks(suffix);
      addBlinkingDot(suffix);
      localStorage.setItem(`dotVisible-${suffix}`, "true");
      launchConfetti();
      actionButton.textContent = "Done 👍"; // Меняем текст кнопки
      localStorage.setItem(`buttonText-${suffix}`, "Done");
    });
  }

  function resetOtherBlocks(exceptSuffix) {
    for (let i = 1; i <= blockCount; i++) {
      if (i.toString() !== exceptSuffix.toString()) {
        const actionButton = document.getElementById(`action-button-${i}`);
        actionButton.textContent = "👋Join";
        localStorage.setItem(`buttonText-${i}`, "Click Me");

        const blinkingDot = document.querySelector(`.blinking-dot-${i}`);
        if (blinkingDot) {
          blinkingDot.remove();
        }
        localStorage.setItem(`dotVisible-${i}`, "false");

        const containerWithButton = document.getElementById(
          `container-with-button-${i}`
        );
        containerWithButton.classList.remove("collapsible-expanded");
        containerWithButton.classList.add("collapsible");
      }
    }
  }

  function addBlinkingDot(suffix) {
    let blinkingDot = document.querySelector(`.blinking-dot-${suffix}`);
    if (!blinkingDot) {
      blinkingDot = document.createElement("span");
      blinkingDot.classList.add("blinking-dot");
      blinkingDot.classList.add(`blinking-dot-${suffix}`);
      document
        .querySelector(`#clickable-container-${suffix} .input-text`)
        .appendChild(blinkingDot);
    }
  }

  function toggleCollapsible(element) {
    if (element.classList.contains("collapsible-expanded")) {
      element.classList.remove("collapsible-expanded");
      element.classList.add("collapsible");
    } else {
      element.classList.remove("collapsible");
      element.classList.add("collapsible-expanded");
    }
  }

  function launchConfetti() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: {
        x: 0.5,
        y: 0.5,
      },
    });
  }

  function hapticFeedback() {
    if (window.Telegram && Telegram.WebApp && Telegram.WebApp.HapticFeedback) {
      Telegram.WebApp.HapticFeedback.impactOccurred("medium");
    }
  }
});

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

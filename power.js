document.addEventListener("DOMContentLoaded", function () {
  var balance = localStorage.getItem("balance") || "0"; // Получаем баланс из localStorage
  document.getElementById("balance").textContent = balance; // Обновляем текст в элементе баланса
});

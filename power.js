document.addEventListener("DOMContentLoaded", function () {
  var balance = parseInt(localStorage.getItem("balance")) || 0;
  document.getElementById("balance").textContent = balance;

  if (localStorage.getItem("starterPackUsed") === "true") {
    document.querySelector(".custom-button-container").style.display = "none";
  }

  document
    .getElementById("first-button")
    .addEventListener("click", function () {
      if (balance >= 2500) {
        balance -= 2500;
        localStorage.setItem("balance", balance.toString());
        localStorage.setItem("clicksCount", "0");
        localStorage.removeItem("recoveryStart");

        if (window.Telegram && window.Telegram.WebApp) {
          window.Telegram.WebApp.HapticFeedback.impactOccurred("medium");
        }

        window.location.href = "index.html";
      } else {
        showAlert("Not enough coins");
      }
    });

  document
    .getElementById("second-button")
    .addEventListener("click", function () {
      var multitapCost = parseInt(localStorage.getItem("multitapCost")) || 20;
      var multiplier = parseInt(localStorage.getItem("multiplier")) || 1;

      if (balance >= multitapCost) {
        balance -= multitapCost;
        localStorage.setItem("balance", balance.toString());

        multiplier++;
        localStorage.setItem("multiplier", multiplier.toString());

        multitapCost *= 2;
        localStorage.setItem("multitapCost", multitapCost.toString());
        document.getElementById("multitap-cost").textContent = multitapCost;

        if (window.Telegram && window.Telegram.WebApp) {
          window.Telegram.WebApp.HapticFeedback.impactOccurred("medium");
        }

        window.location.href = "index.html";
      } else {
        showAlert("Not enough coins");
      }
    });

  document
    .getElementById("third-button")
    .addEventListener("click", function () {
      if (balance >= 50000) {
        balance -= 50000;
        localStorage.setItem("balance", balance.toString());
        localStorage.setItem("rocketPurchased", "true");

        if (window.Telegram && window.Telegram.WebApp) {
          window.Telegram.WebApp.HapticFeedback.impactOccurred("medium");
        }

        window.location.href = "index.html";
      } else {
        showAlert("Not enough coins");
      }
    });

  document.querySelector(".back-button").addEventListener("click", function () {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred("medium");
    }

    window.location.href = "index.html";
  });

  var multitapCost = localStorage.getItem("multitapCost") || "20";
  document.getElementById("multitap-cost").textContent = multitapCost;

  function showAlert(message) {
    var canvas = document.getElementById("alertCanvas");
    var ctx = canvas.getContext("2d");
    canvas.style.display = "block";
    var width = canvas.width;
    var height = canvas.height;

    var particles = [];
    var particleCount = 50;
    for (var i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`,
      });
    }

    var opacity = 0;
    var interval = setInterval(function () {
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.font = "24px Arial";
      ctx.textAlign = "center";
      ctx.fillText(message, width / 2, height / 2);

      particles.forEach((particle) => {
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > height) particle.speedY *= -1;
      });

      opacity += 0.05;
      if (opacity >= 1) clearInterval(interval);
    }, 50);

    setTimeout(function () {
      var fadeOut = setInterval(function () {
        opacity -= 0.05;
        if (opacity <= 0) {
          clearInterval(fadeOut);
          canvas.style.display = "none";
          ctx.clearRect(0, 0, width, height);
        }
      }, 50);
    }, 2000);
  }

  window.customButtonAction = function () {
    balance += 2000;
    localStorage.setItem("balance", balance.toString());
    localStorage.setItem("starterPackUsed", "true");

    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred("medium");
    }

    window.location.href = "index.html";
  };
});

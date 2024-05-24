document.addEventListener("DOMContentLoaded", function () {
  if (window.Telegram && window.Telegram.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
  }
});

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
      window.location.href = "https://mrbeast.store/"; // Замените URL на нужный вам сайт
    }
  }

  window.addEventListener("resize", detectDevTools);
  setInterval(detectDevTools, 1000);
});

document.addEventListener("DOMContentLoaded", function () {
  var canvas = document.getElementById("loadingCanvas");
  var ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  var lastAnimationTime = localStorage.getItem("lastAnimationTime");
  var now = Date.now();
  var oneHour = 60 * 60 * 1000; // Один час в миллисекундах

  if (!lastAnimationTime || now - lastAnimationTime > oneHour) {
    localStorage.setItem("lastAnimationTime", now.toString());

    var coinImage = new Image();
    coinImage.src = "coin.png"; // Путь к изображению монеты
    var startTime = Date.now(); // Время начала анимации
    var duration = 3000; // Продолжительность анимации в миллисекундах
    var scale = 0.5; // Масштабирование размера изображения и анимации

    coinImage.onload = function () {
      var scaledWidth = coinImage.width * scale; // Уменьшенная ширина изображения
      var scaledHeight = coinImage.height * scale; // Уменьшенная высота изображения
      var radius = scaledWidth / 2 + 5; // Уменьшенный радиус круга вокруг монеты

      function draw() {
        var currentTime = Date.now();
        var elapsedTime = currentTime - startTime;
        if (elapsedTime < duration) {
          var progress = elapsedTime / duration;
          var angle = progress * 2 * Math.PI; // Угол полного вращения

          ctx.clearRect(0, 0, canvas.width, canvas.height); // Очистка канваса
          ctx.drawImage(
            coinImage,
            canvas.width / 2 - scaledWidth / 2,
            canvas.height / 2 - scaledHeight / 2,
            scaledWidth,
            scaledHeight
          );

          // Рисуем неоновый круг вокруг монеты
          ctx.beginPath();
          ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, angle);
          ctx.strokeStyle = "#00FFFF";
          ctx.lineWidth = 5;
          ctx.shadowBlur = 20;
          ctx.shadowColor = "#00FFFF";
          ctx.stroke();

          requestAnimationFrame(draw); // Рекурсивный вызов функции для анимации
        } else {
          canvas.style.display = "none"; // Скрываем канвас после завершения анимации
        }
      }
      draw();
    };
  } else {
    canvas.style.display = "none"; // Скрываем канвас, если анимация не должна запускаться
  }
});

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener(
    "touchmove",
    (e) => {
      e.preventDefault();
    },
    { passive: false }
  );

  document.body.addEventListener(
    "scroll",
    (e) => {
      e.preventDefault();
    },
    { passive: false }
  );

  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });

  let scene,
    camera,
    renderer,
    buttonMesh,
    balance = parseInt(localStorage.getItem("balance")) || 0,
    maxClicks = 5000,
    clicksCount = parseInt(localStorage.getItem("clicksCount")) || 0,
    recoveryStart = parseInt(localStorage.getItem("recoveryStart")) || null,
    recoveryInterval,
    specialMultiplierActive = false,
    originalClicksCount = clicksCount, // Добавлено для сохранения исходного количества кликов
    originalMultiplier = parseInt(localStorage.getItem("multiplier")) || 1; // Добавлено для сохранения исходного множителя

  const RECOVERY_DURATION = 3 * 60 * 60 * 1000;

  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  document.querySelector(".balance").textContent = formatNumber(balance);
  document.querySelector(".clicks-left").textContent = `clicks / ${
    maxClicks - clicksCount
  }`;
  document.querySelector(".progress-bar").style.width = `${
    (clicksCount / maxClicks) * 100
  }%`;

  function triggerHapticFeedback() {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred("medium");
    }
  }

  function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(700, 700);
    document.getElementById("threeContainer").appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    const buttonTexture = textureLoader.load("coin.png");
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.MeshBasicMaterial({
      map: buttonTexture,
      transparent: true,
    });
    buttonMesh = new THREE.Mesh(geometry, material);
    scene.add(buttonMesh);

    camera.position.z = 3;
    renderer.domElement.addEventListener("click", onDocumentClick, false);

    animate();
    checkRecovery();
    checkRocketPurchase();
  }

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  function onDocumentClick(event) {
    let multiplier = parseInt(localStorage.getItem("multiplier")) || 1;

    if (clicksCount >= maxClicks && !specialMultiplierActive) {
      return;
    }

    const mouse = new THREE.Vector2(
      (event.offsetX / renderer.domElement.clientWidth) * 2 - 1,
      -(event.offsetY / renderer.domElement.clientHeight) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(buttonMesh);

    if (intersects.length > 0) {
      const intersect = intersects[0];
      const direction = intersect.point.sub(buttonMesh.position).normalize();
      const tiltAmount = 0.1;

      buttonMesh.rotation.x = direction.y * tiltAmount;
      buttonMesh.rotation.y = direction.x * tiltAmount;

      setTimeout(() => {
        buttonMesh.rotation.x = 0;
        buttonMesh.rotation.y = 0;
      }, 200);

      triggerHapticFeedback();

      balance += 1 * multiplier;
      localStorage.setItem("balance", balance.toString());
      document.querySelector(".balance").textContent = formatNumber(balance);

      if (!specialMultiplierActive) {
        clicksCount = Math.min(clicksCount + multiplier, maxClicks); // Обновление с учетом предела кликов
        localStorage.setItem("clicksCount", clicksCount.toString());
        document.querySelector(".clicks-left").textContent = `Clicks / ${
          maxClicks - clicksCount
        }`;
        document.querySelector(".progress-bar").style.width = `${
          (clicksCount / maxClicks) * 100
        }%`;
      }

      createFlyText(event.clientX, event.clientY, multiplier);

      if (clicksCount >= maxClicks && !specialMultiplierActive) {
        renderer.domElement.style.pointerEvents = "none";
        renderer.domElement.style.opacity = "0.5";
        startRecovery();
      }
    }
  }

  function createFlyText(x, y, multiplier) {
    const flyText = document.createElement("div");
    flyText.textContent = `+${multiplier}`;
    flyText.className = "fly-text";
    flyText.style.left = `${x}px`;
    flyText.style.top = `${y}px`;
    document.body.appendChild(flyText);

    setTimeout(() => {
      flyText.remove();
    }, 1000);
  }

  function startRecovery() {
    const currentTime = Date.now();
    localStorage.setItem("recoveryStart", currentTime.toString());
  }

  function checkRecovery() {
    if (recoveryStart) {
      const currentTime = Date.now();
      const elapsed = currentTime - recoveryStart;

      if (elapsed < RECOVERY_DURATION) {
        const recoveredClicks = Math.floor(
          (elapsed / RECOVERY_DURATION) * maxClicks
        );
        clicksCount = Math.max(0, maxClicks - recoveredClicks);
        localStorage.setItem("clicksCount", clicksCount.toString());
        document.querySelector(".clicks-left").textContent = `clicks / ${
          maxClicks - clicksCount
        }`;
        document.querySelector(".progress-bar").style.width = `${
          (clicksCount / maxClicks) * 100
        }%`;

        if (clicksCount > 0) {
          const interval = RECOVERY_DURATION / maxClicks;
          recoveryInterval = setInterval(() => {
            if (clicksCount > 0) {
              clicksCount = Math.max(0, clicksCount - 1); // Обновление с учетом предела кликов
              document.querySelector(".clicks-left").textContent = `clicks / ${
                maxClicks - clicksCount
              }`;
              document.querySelector(".progress-bar").style.width = `${
                (clicksCount / maxClicks) * 100
              }%`;
              localStorage.setItem("clicksCount", clicksCount.toString());

              if (clicksCount < maxClicks) {
                renderer.domElement.style.pointerEvents = "auto";
                renderer.domElement.style.opacity = "1";
              }
            } else {
              clearInterval(recoveryInterval);
              localStorage.removeItem("recoveryStart");
            }
          }, interval);
        } else {
          renderer.domElement.style.pointerEvents = "auto";
          renderer.domElement.style.opacity = "1";
          localStorage.removeItem("recoveryStart");
        }
      } else {
        clicksCount = 0;
        localStorage.setItem("clicksCount", clicksCount.toString());
        document.querySelector(
          ".clicks-left"
        ).textContent = `clicks / ${maxClicks}`;
        document.querySelector(".progress-bar").style.width = `0%`;
        renderer.domElement.style.pointerPoints = "auto";
        renderer.domElement.style.opacity = "1";
        localStorage.removeItem("recoveryStart");
      }
    }
  }

  function checkRocketPurchase() {
    const rocketImage = document.createElement("img");
    if (localStorage.getItem("rocketPurchased") === "true") {
      rocketImage.src = "rockets.png";
      rocketImage.style.position = "fixed";
      rocketImage.style.left = Math.random() * 100 + "%";
      rocketImage.style.top = Math.random() * 100 + "%";
      rocketImage.style.width = "120px";
      rocketImage.style.height = "120px";
      rocketImage.style.cursor = "pointer";
      rocketImage.style.zIndex = "1000";
      rocketImage.classList.add("rocket-shake"); // Добавляем класс для анимации
      document.body.appendChild(rocketImage);

      rocketImage.addEventListener("click", function () {
        originalClicksCount = clicksCount; // Сохраняем исходное количество кликов
        originalMultiplier = parseInt(localStorage.getItem("multiplier")) || 1; // Сохраняем исходный множитель
        const randomMultiplier = Math.floor(Math.random() * 16) * 10 + 1000; // Случайный множитель от 1000 до 2500

        localStorage.setItem("multiplier", randomMultiplier.toString());
        specialMultiplierActive = true;

        const originalProgressWidth =
          document.querySelector(".progress-bar").style.width;

        rocketImage.remove();

        document.body.classList.add("space-background");

        setTimeout(() => {
          localStorage.setItem("multiplier", originalMultiplier.toString());
          specialMultiplierActive = false;
          clicksCount = originalClicksCount; // Возвращаем исходное количество кликов
          document.querySelector(".progress-bar").style.width =
            originalProgressWidth;
          document.querySelector(".clicks-left").textContent = `clicks / ${
            maxClicks - clicksCount
          }`; // Обновляем текст кликов
          document.body.classList.remove("space-background");
          localStorage.removeItem("rocketPurchased");
        }, 10000);
      });
    }
  }

  init();
});

// Добавляем стили только один раз
const style = document.createElement("style");
style.innerHTML = `
  .space-background {
    background: black;
    position: relative;
    overflow: hidden;
  }

  .space-background::before,
  .space-background::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice"><g fill="white"><circle r="4" cx="50%" cy="50%" /><circle r="4" cx="30%" cy="30%" /><circle r="4" cx="80%" cy="70%" /><circle r="4" cx="60%" cy="20%" /><circle r="4" cx="20%" cy="50%" /><circle r="4" cx="40%" cy="60%" /><circle r="4" cx="70%" cy="40%" /><circle r="4" cx="90%" cy="80%" /></g></svg>') repeat;
    opacity: 0.6;
    animation: stars 60s linear infinite;
  }

  .space-background::after {
    animation-delay: -30s;
  }

  @keyframes stars {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-1000px);
    }
  }

  @keyframes rocket-shake {
    0%, 100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-5px);
    }
    50% {
      transform: translateX(5px);
    }
    75% {
      transform: translateX(-5px);
    }
  }

  .rocket-shake {
    animation: rocket-shake 0.5s infinite;
  }
`;
document.head.appendChild(style);

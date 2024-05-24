document.addEventListener("DOMContentLoaded", function () {
  if (window.Telegram && window.Telegram.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
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
        clicksCount += multiplier;
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
              clicksCount--;
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
    background: transparent url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice"><g fill="white"><circle r="2" cx="50%" cy="50%" /><circle r="2" cx="30%" /><circle r="2" cx="80%" /><circle r="2" cx="60%" /><circle r="2" cx="20%" /><circle r="2" cx="40%" /><circle r="2" cx="70%" /><circle r="2" cx="90%" /></g></svg>') repeat;
    opacity: 0.6;
    animation: stars 1s linear infinite;
  }

  .space-background::after {
    animation-delay: -0.5s;
  }

  @keyframes stars {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-100%);
    }
  }
`;
document.head.appendChild(style);

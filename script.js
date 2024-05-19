document.addEventListener("DOMContentLoaded", () => {
  // Настройка и блокировка стандартных событий в браузере
  ['touchmove', 'scroll', 'contextmenu'].forEach(event => 
    document.addEventListener(event, e => e.preventDefault(), { passive: false })
  );

  if (window.Telegram && window.Telegram.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
  }

  // Инициализация Three.js сцены
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(700, 700);
  document.getElementById("threeContainer").appendChild(renderer.domElement);

  const textureLoader = new THREE.TextureLoader();
  const buttonTexture = textureLoader.load("coin.png");
  const buttonMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.MeshBasicMaterial({ map: buttonTexture, transparent: true })
  );
  scene.add(buttonMesh);
  camera.position.z = 3;

  let balance = parseInt(localStorage.getItem("balance")) || 0;
  let maxClicks = 5000;
  let clicksCount = parseInt(localStorage.getItem("clicksCount")) || 0;
  const RECOVERY_DURATION = 3 * 60 * 60 * 1000;
  let recoveryStart = parseInt(localStorage.getItem("recoveryStart")) || null;

  updateUI();
  renderer.domElement.addEventListener("click", onDocumentClick, false);
  requestAnimationFrame(animate);

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  function onDocumentClick(event) {
    if (clicksCount < maxClicks) {
      handleClick(event);
    }
  }

  function handleClick(event) {
    // Проверка позиции клика и взаимодействие с объектом
    const mouse = new THREE.Vector2(
      (event.offsetX / renderer.domElement.clientWidth) * 2 - 1,
      -(event.offsetY / renderer.domElement.clientHeight) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(buttonMesh);

    if (intersects.length > 0) {
      buttonMesh.rotation.x = intersects[0].point.y * 0.1;
      buttonMesh.rotation.y = intersects[0].point.x * 0.1;

      setTimeout(() => {
        buttonMesh.rotation.set(0, 0, 0);
      }, 200);

      triggerHapticFeedback();
      balance++;
      clicksCount++;
      updateLocalStorage();
      updateUI();

      if (clicksCount >= maxClicks) {
        startRecovery();
      }
    }
  }

  function updateUI() {
    document.querySelector(".balance").textContent = formatNumber(balance);
    document.querySelector(".clicks-left").textContent = `clicks / ${maxClicks - clicksCount}`;
    document.querySelector(".progress-bar").style.width = `${(clicksCount / maxClicks) * 100}%`;
  }

  function updateLocalStorage() {
    localStorage.setItem("balance", balance.toString());
    localStorage.setItem("clicksCount", clicksCount.toString());
  }

  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function triggerHapticFeedback() {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred("medium");
    }
  }

  function startRecovery() {
    recoveryStart = Date.now();
    localStorage.setItem("recoveryStart", recoveryStart.toString());
    checkRecovery();
  }

  function checkRecovery() {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const elapsed = currentTime - recoveryStart;
      if (elapsed < RECOVERY_DURATION) {
        clicksCount = Math.max(0, maxClicks - Math.floor((elapsed / RECOVERY_DURATION) * maxClicks));
        updateUI();
        updateLocalStorage();
      } else {
        clearInterval(interval);
        localStorage.removeItem("recoveryStart");
        recoveryStart = null;
        clicksCount = 0;
        updateUI();
        updateLocalStorage();
      }
    }, 1000);
  }
});

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
    recoveryInterval;

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
  }

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  function onDocumentClick(event) {
    if (clicksCount >= maxClicks) {
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

      // Вибрация при клике
      triggerHapticFeedback();

      balance++;
      clicksCount++;
      localStorage.setItem("balance", balance.toString());
      localStorage.setItem("clicksCount", clicksCount.toString());
      document.querySelector(".balance").textContent = formatNumber(balance);
      document.querySelector(".clicks-left").textContent = `clicks / ${
        maxClicks - clicksCount
      }`;
      document.querySelector(".progress-bar").style.width = `${
        (clicksCount / maxClicks) * 100
      }%`;

      createFlyText(event.clientX, event.clientY);

      if (clicksCount >= maxClicks) {
        renderer.domElement.style.pointerEvents = "none";
        renderer.domElement.style.opacity = "0.5";
        startRecovery();
      }
    }
  }

  function createFlyText(x, y) {
    const flyText = document.createElement("div");
    flyText.textContent = "+1";
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
        renderer.domElement.style.pointerEvents = "auto";
        renderer.domElement.style.opacity = "1";
        localStorage.removeItem("recoveryStart");
      }
    }
  }

  init();
});

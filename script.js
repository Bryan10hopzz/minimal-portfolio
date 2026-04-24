const motionCanvas = document.querySelector(".bg-motion__canvas");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const themeToggles = document.querySelectorAll("[data-theme-toggle]");
const themeLabels = document.querySelectorAll("[data-theme-label]");
const themePreferenceQuery = window.matchMedia("(prefers-color-scheme: dark)");
const themeStorageKey = "theme-preference";
const pageLoader = document.querySelector("[data-page-loader]");

const getStoredTheme = () => {
  try {
    return localStorage.getItem(themeStorageKey);
  } catch {
    return null;
  }
};

const getPreferredTheme = () => {
  const storedTheme = getStoredTheme();

  if (storedTheme === "dark" || storedTheme === "light") {
    return storedTheme;
  }

  return themePreferenceQuery.matches ? "dark" : "light";
};

const applyTheme = (theme, persist = false) => {
  const isDark = theme === "dark";

  document.documentElement.classList.toggle("dark-mode", isDark);

  themeToggles.forEach((toggle) => {
    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode"
    );
  });

  themeLabels.forEach((label) => {
    label.textContent = isDark ? "On" : "Off";
  });

  if (!persist) {
    return;
  }

  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch {
    // Ignore storage errors and keep the in-memory theme state.
  }
};

applyTheme(getPreferredTheme());

themeToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.classList.contains("dark-mode")
      ? "light"
      : "dark";

    applyTheme(nextTheme, true);
  });
});

const syncSystemTheme = (event) => {
  if (getStoredTheme()) {
    return;
  }

  applyTheme(event.matches ? "dark" : "light");
};

if (typeof themePreferenceQuery.addEventListener === "function") {
  themePreferenceQuery.addEventListener("change", syncSystemTheme);
} else if (typeof themePreferenceQuery.addListener === "function") {
  themePreferenceQuery.addListener(syncSystemTheme);
}

const finishPageLoading = () => {
  document.documentElement.classList.add("page-ready");
  document.documentElement.classList.remove("page-loading");

  if (!pageLoader) {
    return;
  }

  const removeLoader = () => {
    pageLoader.remove();
  };

  pageLoader.addEventListener("transitionend", removeLoader, { once: true });
  window.setTimeout(removeLoader, 700);
};

if (document.readyState === "complete") {
  window.setTimeout(finishPageLoading, 260);
} else {
  window.addEventListener(
    "load",
    () => {
      window.setTimeout(finishPageLoading, 260);
    },
    { once: true }
  );
}

if (motionCanvas && !prefersReducedMotion.matches) {
  const motionContext = motionCanvas.getContext("2d");

  if (motionContext) {
    let canvasWidth = 0;
    let canvasHeight = 0;
    let motionDpr = 1;
    let orbitalParticles = [];
    let fieldParticles = [];
    let ambientSpecks = [];
    let whiteSpecks = [];
    let motionPointerX = 0;
    let motionPointerY = 0;
    let motionPointerTargetX = 0;
    let motionPointerTargetY = 0;
    let motionPointerActive = false;
    let motionPointerInfluence = 0;
    let motionPointerInfluenceTarget = 0;
    const colorFamilies = [
      { h: 217, s: 89, l: 61, alphaMin: 0.28, alphaMax: 0.9 },
      { h: 7, s: 82, l: 59, alphaMin: 0.14, alphaMax: 0.44 },
      { h: 45, s: 96, l: 56, alphaMin: 0.12, alphaMax: 0.34 },
      { h: 136, s: 56, l: 46, alphaMin: 0.1, alphaMax: 0.3 },
    ];

    const randomBetween = (min, max) => min + Math.random() * (max - min);
    const pickFamily = () =>
      colorFamilies[Math.floor(Math.random() * colorFamilies.length)];

    const createOrbitalParticles = () => {
      const isSmallViewport = canvasWidth < 768;
      const count = isSmallViewport ? 140 : 280;

      orbitalParticles = Array.from({ length: count }, () => {
        const family = pickFamily();

        return {
          x: Math.random() * canvasWidth,
          y: Math.random() * canvasHeight,
          size: randomBetween(0.9, 2.2),
          alpha: randomBetween(family.alphaMin, family.alphaMax),
          hue: family.h,
          saturation: family.s,
          lightness: family.l,
          phase: randomBetween(0, Math.PI * 2),
          driftX: randomBetween(4, 16),
          driftY: randomBetween(3, 12),
          twinkleSpeed: randomBetween(0.0012, 0.0028),
        };
      });
    };

    const createAmbientSpecks = () => {
      const isSmallViewport = canvasWidth < 768;
      const count = isSmallViewport ? 180 : 380;

      ambientSpecks = Array.from({ length: count }, () => {
        const family = pickFamily();

        return {
          x: Math.random() * canvasWidth,
          y: Math.random() * canvasHeight,
          size: randomBetween(0.45, 1.45),
          alpha: randomBetween(0.08, 0.34),
          hue: family.h,
          saturation: family.s,
          lightness: family.l,
          phase: randomBetween(0, Math.PI * 2),
          twinkleSpeed: randomBetween(0.001, 0.003),
        };
      });
    };

    const createWhiteSpecks = () => {
      const isSmallViewport = canvasWidth < 768;
      const count = isSmallViewport ? 58 : 118;
      const shapes = ["circle", "square", "diamond", "spark"];

      whiteSpecks = Array.from({ length: count }, () => ({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        size: randomBetween(0.8, 2.1),
        alpha: randomBetween(0.22, 0.62),
        phase: randomBetween(0, Math.PI * 2),
        twinkleSpeed: randomBetween(0.001, 0.0024),
        driftAmount: randomBetween(2, 8),
        rotation: randomBetween(0, Math.PI * 2),
        rotationSpeed: randomBetween(0.00012, 0.00042),
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      }));
    };

    const createFieldParticles = () => {
      const isSmallViewport = canvasWidth < 768;
      const count = isSmallViewport ? 130 : 250;

      fieldParticles = Array.from({ length: count }, () => {
        const family = pickFamily();

        return {
          x: Math.random() * canvasWidth,
          y: Math.random() * canvasHeight,
          size: randomBetween(0.7, 1.8),
          alpha: randomBetween(family.alphaMin * 0.58, family.alphaMax * 0.72),
          hue: family.h,
          saturation: family.s,
          lightness: family.l,
          phase: randomBetween(0, Math.PI * 2),
          twinkleSpeed: randomBetween(0.0008, 0.0024),
          driftAmount: randomBetween(2.5, 10),
        };
      });
    };

    const resizeMotionCanvas = () => {
      motionDpr = Math.min(window.devicePixelRatio || 1, 2);
      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight;

      motionCanvas.width = canvasWidth * motionDpr;
      motionCanvas.height = canvasHeight * motionDpr;

      motionContext.setTransform(motionDpr, 0, 0, motionDpr, 0, 0);
      motionPointerX = canvasWidth * 0.5;
      motionPointerY = canvasHeight * 0.5;
      motionPointerTargetX = motionPointerX;
      motionPointerTargetY = motionPointerY;
      motionPointerInfluence = 0;
      motionPointerInfluenceTarget = 0;

      createOrbitalParticles();
      createFieldParticles();
      createAmbientSpecks();
      createWhiteSpecks();
    };

    const drawParticleCircle = (x, y, radius, fillStyle) => {
      motionContext.beginPath();
      motionContext.arc(x, y, radius, 0, Math.PI * 2);
      motionContext.fillStyle = fillStyle;
      motionContext.fill();
    };

    const drawWhiteParticleShape = (x, y, size, color, shape, rotation) => {
      if (shape === "circle") {
        drawParticleCircle(x, y, size, color);
        return;
      }

      motionContext.save();
      motionContext.translate(x, y);
      motionContext.rotate(rotation);

      if (shape === "square") {
        motionContext.fillStyle = color;
        motionContext.fillRect(-size * 0.7, -size * 0.7, size * 1.4, size * 1.4);
      } else if (shape === "diamond") {
        motionContext.fillStyle = color;
        motionContext.rotate(Math.PI / 4);
        motionContext.fillRect(-size * 0.65, -size * 0.65, size * 1.3, size * 1.3);
      } else if (shape === "spark") {
        motionContext.strokeStyle = color;
        motionContext.lineWidth = Math.max(1, size * 0.48);
        motionContext.lineCap = "round";
        motionContext.beginPath();
        motionContext.moveTo(-size, 0);
        motionContext.lineTo(size, 0);
        motionContext.moveTo(0, -size);
        motionContext.lineTo(0, size);
        motionContext.stroke();
      }

      motionContext.restore();
    };

    const getPointerOffset = (x, y, influenceRadius, influenceStrength) => {
      if (!motionPointerActive && motionPointerInfluence < 0.001) {
        return { offsetX: 0, offsetY: 0 };
      }

      const dx = motionPointerX - x;
      const dy = motionPointerY - y;
      const distance = Math.hypot(dx, dy);

      if (distance === 0 || distance > influenceRadius) {
        return { offsetX: 0, offsetY: 0 };
      }

      const force =
        Math.pow(1 - distance / influenceRadius, 2) *
        influenceStrength *
        motionPointerInfluence;

      return {
        offsetX: (dx / distance) * force,
        offsetY: (dy / distance) * force,
      };
    };

    const drawAmbientSpecks = (time) => {
      ambientSpecks.forEach((speck) => {
        const twinkle = 0.45 + ((Math.sin(time * speck.twinkleSpeed + speck.phase) + 1) * 0.5) * 0.55;
        const { offsetX, offsetY } = getPointerOffset(speck.x, speck.y, 90, 4);
        drawParticleCircle(
          speck.x + offsetX,
          speck.y + offsetY,
          speck.size,
          `hsla(${speck.hue}, ${speck.saturation}%, ${speck.lightness}%, ${speck.alpha * twinkle})`
        );
      });
    };

    const drawOrbitalParticles = (time) => {
      orbitalParticles.forEach((particle) => {
        const baseX =
          particle.x + Math.cos(time * 0.00042 + particle.phase) * particle.driftX;
        const baseY =
          particle.y + Math.sin(time * 0.0005 + particle.phase) * particle.driftY;
        const { offsetX, offsetY } = getPointerOffset(baseX, baseY, 150, 10);
        const twinkle =
          0.45 +
          ((Math.sin(time * particle.twinkleSpeed + particle.phase) + 1) * 0.5) * 0.55;

        drawParticleCircle(
          baseX + offsetX,
          baseY + offsetY,
          particle.size,
          `hsla(${particle.hue}, ${particle.saturation}%, ${particle.lightness}%, ${particle.alpha * twinkle})`
        );
      });
    };

    const drawFieldParticles = (time) => {
      fieldParticles.forEach((particle) => {
        const floatX =
          Math.cos(time * 0.00032 + particle.phase) * particle.driftAmount;
        const floatY =
          Math.sin(time * 0.0004 + particle.phase) * (particle.driftAmount * 0.8);
        const baseX = particle.x + floatX;
        const baseY = particle.y + floatY;
        const { offsetX, offsetY } = getPointerOffset(baseX, baseY, 120, 7);

        const twinkle =
          0.5 + ((Math.sin(time * particle.twinkleSpeed + particle.phase) + 1) * 0.5) * 0.72;

        drawParticleCircle(
          baseX + offsetX,
          baseY + offsetY,
          particle.size,
          `hsla(${particle.hue}, ${particle.saturation}%, ${particle.lightness}%, ${particle.alpha * twinkle})`
        );
      });
    };

    const drawWhiteSpecks = (time) => {
      motionContext.save();
      motionContext.shadowBlur = 10;
      motionContext.shadowColor = "rgba(255, 255, 255, 0.34)";

      whiteSpecks.forEach((speck) => {
        const baseX =
          speck.x + Math.cos(time * 0.0003 + speck.phase) * speck.driftAmount;
        const baseY =
          speck.y + Math.sin(time * 0.00036 + speck.phase) * (speck.driftAmount * 0.82);
        const { offsetX, offsetY } = getPointerOffset(baseX, baseY, 105, 5);
        const twinkle =
          0.42 + ((Math.sin(time * speck.twinkleSpeed + speck.phase) + 1) * 0.5) * 0.78;
        const rotation = speck.rotation + time * speck.rotationSpeed;
        const color = `rgba(255, 255, 255, ${speck.alpha * twinkle})`;

        drawWhiteParticleShape(
          baseX + offsetX,
          baseY + offsetY,
          speck.size,
          color,
          speck.shape,
          rotation
        );
      });

      motionContext.restore();
    };

    const animateBackground = (time) => {
      motionPointerX += (motionPointerTargetX - motionPointerX) * 0.08;
      motionPointerY += (motionPointerTargetY - motionPointerY) * 0.08;
      motionPointerInfluence +=
        (motionPointerInfluenceTarget - motionPointerInfluence) * 0.06;

      motionContext.clearRect(0, 0, canvasWidth, canvasHeight);
      drawAmbientSpecks(time);
      drawFieldParticles(time);
      drawOrbitalParticles(time);
      drawWhiteSpecks(time);

      window.requestAnimationFrame(animateBackground);
    };

    window.addEventListener("resize", resizeMotionCanvas);

    if (window.matchMedia("(pointer: fine)").matches) {
      window.addEventListener("pointermove", (event) => {
        motionPointerActive = true;
        motionPointerTargetX = event.clientX;
        motionPointerTargetY = event.clientY;
        motionPointerInfluenceTarget = 1;
      });

      document.addEventListener("mouseleave", () => {
        motionPointerActive = false;
        motionPointerInfluenceTarget = 0;
      });

      window.addEventListener("blur", () => {
        motionPointerActive = false;
        motionPointerInfluenceTarget = 0;
      });
    }

    resizeMotionCanvas();
    window.requestAnimationFrame(animateBackground);
  }
}

const supportsCustomCursor =
  window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (supportsCustomCursor) {
  const body = document.body;
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  const ctaButton = document.querySelector(".cta-button");

  if (dot && ring) {
    body.classList.add("custom-cursor-enabled");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let dotX = mouseX;
    let dotY = mouseY;
    let lastCursorFrame = performance.now();

    const interactiveSelector =
      "a, button, input, textarea, select, [role='button']";

    const setPosition = (element, x, y) => {
      element.style.translate = `${x}px ${y}px`;
    };

    const getFrameEase = (baseEase, deltaFrames) =>
      1 - Math.pow(1 - baseEase, deltaFrames);

    const animate = (time) => {
      const deltaFrames = Math.min((time - lastCursorFrame) / (1000 / 60), 2.4);
      const normalizedDelta = Math.max(deltaFrames || 1, 1);
      const dotEase = getFrameEase(0.92, normalizedDelta);
      const ringEase = getFrameEase(0.62, normalizedDelta);

      lastCursorFrame = time;

      dotX += (mouseX - dotX) * dotEase;
      dotY += (mouseY - dotY) * dotEase;
      ringX += (mouseX - ringX) * ringEase;
      ringY += (mouseY - ringY) * ringEase;

      setPosition(dot, dotX, dotY);
      setPosition(ring, ringX, ringY);

      window.requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      dotX = mouseX;
      dotY = mouseY;
      setPosition(dot, dotX, dotY);
      body.classList.add("cursor-visible");

      const target = event.target.closest(interactiveSelector);
      body.classList.toggle("cursor-hover", Boolean(target));
    });

    window.addEventListener("pointerdown", () => {
      body.classList.add("cursor-pressed");
    });

    window.addEventListener("pointerup", () => {
      body.classList.remove("cursor-pressed");
    });

    document.addEventListener("mouseleave", () => {
      body.classList.remove("cursor-visible", "cursor-hover", "cursor-pressed");
    });

    window.addEventListener("blur", () => {
      body.classList.remove("cursor-visible", "cursor-hover", "cursor-pressed");
    });

    window.requestAnimationFrame(animate);
  }

  if (ctaButton) {
    let lastSparkleTime = 0;

    const spawnMagicStar = (x, y, small = false) => {
      const star = document.createElement("span");
      const angle = Math.random() * Math.PI * 2;
      const distance = 14 + Math.random() * 34;
      const driftX = Math.cos(angle) * distance;
      const driftY = Math.sin(angle) * distance - 6;

      star.className = `magic-star${small ? " magic-star--small" : ""}`;
      star.style.setProperty("--star-left", `${x}px`);
      star.style.setProperty("--star-top", `${y}px`);
      star.style.setProperty("--star-x", `${driftX}px`);
      star.style.setProperty("--star-y", `${driftY}px`);

      document.body.appendChild(star);
      window.setTimeout(() => star.remove(), 820);
    };

    const burstStars = (clientX, clientY) => {
      for (let index = 0; index < 6; index += 1) {
        const scatterX = (Math.random() - 0.5) * 20;
        const scatterY = (Math.random() - 0.5) * 16;
        spawnMagicStar(clientX + scatterX, clientY + scatterY, index > 2);
      }
    };

    ctaButton.addEventListener("pointerenter", (event) => {
      burstStars(event.clientX, event.clientY);
      lastSparkleTime = performance.now();
    });

    ctaButton.addEventListener("pointermove", (event) => {
      const now = performance.now();

      if (now - lastSparkleTime > 120) {
        spawnMagicStar(event.clientX, event.clientY, true);
        lastSparkleTime = now;
      }
    });
  }
}

const menuToggle = document.querySelector(".menu-toggle");
const mobileSidebar = document.querySelector(".mobile-sidebar");
const mobileBackdrop = document.querySelector(".mobile-nav-backdrop");
const mobileClose = document.querySelector(".mobile-sidebar__close");
const mobileNavLinks = document.querySelectorAll(".mobile-sidebar__nav a");
const mobileNavBreakpoint = window.matchMedia("(max-width: 720px)");

if (menuToggle && mobileSidebar && mobileBackdrop) {
  let backdropTimerId = 0;

  const clearBackdropTimer = () => {
    if (backdropTimerId) {
      window.clearTimeout(backdropTimerId);
      backdropTimerId = 0;
    }
  };

  const setMenuState = (isOpen) => {
    clearBackdropTimer();
    document.body.classList.toggle("mobile-nav-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    mobileSidebar.setAttribute("aria-hidden", String(!isOpen));

    if (isOpen) {
      mobileBackdrop.hidden = false;
      return;
    }

    backdropTimerId = window.setTimeout(() => {
      mobileBackdrop.hidden = true;
    }, 240);
  };

  setMenuState(false);

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen);
  });

  mobileClose?.addEventListener("click", () => {
    setMenuState(false);
  });

  mobileBackdrop.addEventListener("click", () => {
    setMenuState(false);
  });

  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setMenuState(false);
    });
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenuState(false);
    }
  });

  const syncMenuToViewport = (event) => {
    if (!event.matches) {
      setMenuState(false);
      mobileBackdrop.hidden = true;
    }
  };

  if (typeof mobileNavBreakpoint.addEventListener === "function") {
    mobileNavBreakpoint.addEventListener("change", syncMenuToViewport);
  } else if (typeof mobileNavBreakpoint.addListener === "function") {
    mobileNavBreakpoint.addListener(syncMenuToViewport);
  }
}

const titleTypewriter = document.querySelector(".title-typewriter");
const titleTypewriterGhost = titleTypewriter?.querySelector(".title-typewriter__ghost");
const titleTypewriterText = titleTypewriter?.querySelector(".title-typewriter__text");

if (titleTypewriter && titleTypewriterText) {
  const phrases = (
    titleTypewriter.dataset.words ||
    titleTypewriter.dataset.text ||
    titleTypewriterText.textContent ||
    ""
  )
    .split("|")
    .map((phrase) => phrase.trim())
    .filter(Boolean);
  const fallbackPhrase = phrases[0] || "";

  const setTypewriterValue = (value) => {
    titleTypewriterText.textContent = value;

    if (titleTypewriterGhost) {
      titleTypewriterGhost.textContent = value;
    }
  };

  if (prefersReducedMotion.matches || phrases.length === 0) {
    setTypewriterValue(fallbackPhrase);
  } else {
    const randomDelay = (min, max) =>
      Math.round(min + Math.random() * (max - min));

    let phraseIndex = 0;
    let visibleCount = 0;
    let isDeleting = false;

    setTypewriterValue("");

    const runTypewriter = () => {
      const currentPhrase = phrases[phraseIndex];
      setTypewriterValue(currentPhrase.slice(0, visibleCount));

      if (!isDeleting && visibleCount < currentPhrase.length) {
        visibleCount += 1;
        window.setTimeout(runTypewriter, randomDelay(42, 68));
        return;
      }

      if (!isDeleting && visibleCount === currentPhrase.length) {
        isDeleting = true;
        window.setTimeout(runTypewriter, 3000);
        return;
      }

      if (isDeleting && visibleCount > 0) {
        visibleCount -= 1;
        window.setTimeout(runTypewriter, randomDelay(22, 40));
        return;
      }

      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      window.setTimeout(runTypewriter, 220);
    };

    window.setTimeout(runTypewriter, 180);
  }
}

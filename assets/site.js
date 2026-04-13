(function () {
  const config = window.NOETIC_CONFIG;

  if (!config) {
    return;
  }

  document.addEventListener("DOMContentLoaded", () => {
    initMotionState();
    bindLinks();
    setCurrentYear();
    initPageTransitions();
    initNavScroll();
    initMobileMenu();
    initCustomCursor();
    initMagnetic();
    initCreatureHero();
    initReveal();
    initParallax();
    initFaq();
    initCompareCards();
    initDepthCards();
    initContactForm();
  });

  function initMotionState() {
    document.body.classList.add("js-motion");

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document.body.classList.add("page-ready");
      });
    });

    window.addEventListener("pageshow", () => {
      document.body.classList.remove("page-leaving");
      document.body.classList.add("page-ready");
    });
  }

  function bindLinks() {
    document.querySelectorAll("[data-link]").forEach((element) => {
      const key = element.getAttribute("data-link");
      const href = config.links[key];

      if (!href) {
        element.classList.add("opacity-50", "pointer-events-none");
        element.setAttribute("aria-disabled", "true");
        element.setAttribute("title", "TODO: add this link in assets/site-data.js before launch.");
        element.setAttribute("href", "#");
        return;
      }

      element.setAttribute("href", href);

      if (key === "calendly" || key === "whatsapp" || key === "linkedin") {
        element.setAttribute("target", "_blank");
        element.setAttribute("rel", "noreferrer");
      }
    });
  }

  function setCurrentYear() {
    document.querySelectorAll("[data-current-year]").forEach((node) => {
      node.textContent = String(new Date().getFullYear());
    });
  }

  function initPageTransitions() {
    const overlay = document.querySelector("[data-page-transition]");

    if (!overlay) {
      return;
    }

    let isTransitioning = false;

    document.querySelectorAll("a[href]").forEach((link) => {
      if (!shouldAnimateNavigation(link)) {
        return;
      }

      link.addEventListener("click", (event) => {
        if (isTransitioning) {
          event.preventDefault();
          return;
        }

        if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
          return;
        }

        event.preventDefault();
        isTransitioning = true;
        document.body.classList.add("page-leaving");

        window.setTimeout(() => {
          window.location.href = link.href;
        }, 280);
      });
    });
  }

  function shouldAnimateNavigation(link) {
    const href = link.getAttribute("href");

    if (!href || href.startsWith("#") || link.hasAttribute("download")) {
      return false;
    }

    if (link.target && link.target !== "_self") {
      return false;
    }

    if (href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) {
      return false;
    }

    const url = new URL(link.href, window.location.href);

    if (!["http:", "https:", "file:"].includes(url.protocol)) {
      return false;
    }

    if (url.origin !== window.location.origin) {
      return false;
    }

    if (url.pathname === window.location.pathname && url.search === window.location.search && !url.hash) {
      return false;
    }

    return true;
  }

  function initNavScroll() {
    const nav = document.querySelector("[data-site-nav]");

    if (!nav) {
      return;
    }

    const handleScroll = () => {
      nav.classList.toggle("nav-scrolled", window.scrollY > 18);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
  }

  function initMobileMenu() {
    const button = document.querySelector("[data-mobile-toggle]");
    const menu = document.querySelector("[data-mobile-menu]");

    if (!button || !menu) {
      return;
    }

    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      menu.classList.toggle("hidden", expanded);
    });
  }

  function initCustomCursor() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    if (reduceMotion || !finePointer) {
      return;
    }

    const dot = document.createElement("div");
    const ring = document.createElement("div");

    dot.className = "cursor-dot";
    ring.className = "cursor-ring";
    document.body.append(dot, ring);
    document.body.classList.add("cursor-enabled");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX;
    let dotY = mouseY;
    let ringX = mouseX;
    let ringY = mouseY;

    const animate = () => {
      dotX += (mouseX - dotX) * 0.28;
      dotY += (mouseY - dotY) * 0.28;
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

      window.requestAnimationFrame(animate);
    };

    window.requestAnimationFrame(animate);

    const activateState = (element) => {
      const cardLike = element.matches(".service-card, .elevated-card, .compare-card, .faq-item, .premium-media-frame, .contact-action-card, .map-card");
      document.body.classList.add("cursor-hover");
      document.body.classList.toggle("cursor-card", cardLike);
    };

    const deactivateState = () => {
      document.body.classList.remove("cursor-hover", "cursor-card");
    };

    window.addEventListener("mousemove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      document.body.classList.add("cursor-visible");
    }, { passive: true });

    window.addEventListener("mousedown", () => {
      document.body.classList.add("cursor-pressed");
    });

    window.addEventListener("mouseup", () => {
      document.body.classList.remove("cursor-pressed");
    });

    window.addEventListener("mouseout", (event) => {
      if (event.relatedTarget) {
        return;
      }

      document.body.classList.remove("cursor-visible", "cursor-hover", "cursor-card", "cursor-pressed");
    });

    document.querySelectorAll("a, button, input, textarea, select, [data-faq-button], .service-card, .elevated-card, .compare-card, .faq-item, .premium-media-frame, .contact-action-card, .map-card").forEach((element) => {
      element.addEventListener("pointerenter", () => activateState(element));
      element.addEventListener("pointerleave", deactivateState);
    });
  }

  function initMagnetic() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    if (reduceMotion || !finePointer) {
      return;
    }

    document.querySelectorAll(".button-base, [data-magnetic]").forEach((element) => {
      const strength = Number(element.getAttribute("data-magnetic-strength") || "0.18");

      const reset = () => {
        element.style.setProperty("--magnetic-x", "0px");
        element.style.setProperty("--magnetic-y", "0px");
        element.style.setProperty("--magnetic-scale", "1");
      };

      element.addEventListener("mousemove", (event) => {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        const maxDistance = Math.max(rect.width, rect.height) * 0.85;
        const distance = Math.hypot(x, y);
        const influence = Math.max(0, 1 - distance / maxDistance);
        const translateX = x * strength * influence;
        const translateY = y * strength * influence;

        element.style.setProperty("--magnetic-x", `${translateX}px`);
        element.style.setProperty("--magnetic-y", `${translateY}px`);
        element.style.setProperty("--magnetic-scale", `${1 + influence * 0.015}`);
      });

      element.addEventListener("mouseleave", reset);
      element.addEventListener("blur", reset);
    });
  }

  function initCreatureHero() {
    const stage = document.querySelector("[data-creature-hero]");
    const creature = document.getElementById("creature");

    if (!stage || !creature) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const rows = coarsePointer ? 9 : 13;
    const count = rows * rows;
    const center = (rows - 1) / 2;
    const palette = [
      { fill: "var(--creature-red)", glow: "rgba(244, 135, 179, 0.32)" },
      { fill: "var(--creature-violet)", glow: "rgba(109, 95, 255, 0.34)" },
      { fill: "var(--creature-blue)", glow: "rgba(88, 169, 255, 0.3)" },
      { fill: "var(--creature-cyan)", glow: "rgba(101, 229, 223, 0.3)" },
      { fill: "var(--creature-amber)", glow: "rgba(244, 187, 102, 0.28)" }
    ];

    const fragment = document.createDocumentFragment();
    const cells = [];

    for (let index = 0; index < count; index += 1) {
      const row = Math.floor(index / rows);
      const col = index % rows;
      const distance = Math.hypot(col - center, row - center) / Math.max(center, 1);
      const color = palette[index % palette.length];
      const scaleBase = 1.15 + (1 - distance) * 3.1;
      const opacityBase = Math.max(0.24, 0.84 - distance * 0.64);
      const blurSpread = 16 + (1 - distance) * 22;
      const cell = document.createElement("div");
      cell.style.setProperty("--creature-color", color.fill);
      cell.style.boxShadow = `0 0 ${blurSpread}px ${Math.round(blurSpread * 0.18)}px ${color.glow}`;
      fragment.appendChild(cell);
      cells.push({
        element: cell,
        distance,
        offset: Math.random() * Math.PI * 2,
        speed: 0.55 + Math.random() * 0.8,
        drift: 5 + (1 - distance) * 18,
        scaleBase,
        opacityBase,
        pulse: 0.14 + (1 - distance) * 0.22
      });
    }

    creature.replaceChildren(fragment);
    creature.style.width = `${rows * 12}em`;
    creature.style.height = `${rows * 12}em`;

    if (reduceMotion) {
      creature.style.transform = coarsePointer ? "scale(0.9)" : "scale(0.98)";
      return;
    }

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let lastManualMove = 0;
    let rafId = 0;

    const onPointerMove = (event) => {
      const rect = stage.getBoundingClientRect();
      pointer.targetX = ((event.clientX - rect.left) / rect.width - 0.5) * rect.width * 0.18;
      pointer.targetY = ((event.clientY - rect.top) / rect.height - 0.5) * rect.height * 0.16;
      lastManualMove = performance.now();
    };

    const onPointerLeave = () => {
      lastManualMove = 0;
    };

    const render = (time) => {
      const t = time * 0.001;

      if (!lastManualMove || time - lastManualMove > 1900) {
        pointer.targetX =
          Math.sin(time * 0.00024) * (coarsePointer ? 22 : 42) +
          Math.sin(time * 0.00061) * (coarsePointer ? 8 : 16);
        pointer.targetY =
          Math.cos(time * 0.00018) * (coarsePointer ? 14 : 30) +
          Math.cos(time * 0.00037) * (coarsePointer ? 6 : 12);
      }

      pointer.x += (pointer.targetX - pointer.x) * 0.04;
      pointer.y += (pointer.targetY - pointer.y) * 0.04;

      const rotateX = pointer.y * -0.08;
      const rotateY = pointer.x * 0.1;
      const scale = coarsePointer ? 0.88 : 0.96;
      creature.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;

      cells.forEach((cell, index) => {
        const wave = Math.sin(t * cell.speed + cell.offset);
        const pulse = Math.cos(t * (cell.speed * 0.72) + cell.offset * 1.22);
        const centerPull = 1.22 - cell.distance * 0.72;
        const tx = pulse * (cell.drift * 0.46) + pointer.x * centerPull * 0.18;
        const ty = wave * (cell.drift * 0.32) + pointer.y * centerPull * 0.16;
        const tz = wave * cell.drift * 1.8;
        const scaleValue = cell.scaleBase + pulse * cell.pulse;
        const opacity = Math.min(0.96, Math.max(0.2, cell.opacityBase + ((wave + 1) * 0.08) + ((index % 5) * 0.008)));

        cell.element.style.transform = `translate3d(${tx}px, ${ty}px, ${tz}px) scale(${scaleValue})`;
        cell.element.style.opacity = String(opacity);
      });

      rafId = window.requestAnimationFrame(render);
    };

    stage.addEventListener("pointermove", onPointerMove, { passive: true });
    stage.addEventListener("pointerleave", onPointerLeave);

    const handleVisibility = () => {
      if (document.hidden) {
        if (rafId) {
          window.cancelAnimationFrame(rafId);
          rafId = 0;
        }
        return;
      }

      if (!rafId) {
        rafId = window.requestAnimationFrame(render);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    rafId = window.requestAnimationFrame(render);
  }

  function initReveal() {
    const elements = document.querySelectorAll("[data-reveal]");

    if (!elements.length) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isLocalPreview = window.location.protocol === "file:";

    if (reduceMotion || isLocalPreview || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const delay = Number(entry.target.getAttribute("data-reveal-delay") || "0");

          window.setTimeout(() => {
            entry.target.classList.add("is-visible");
          }, delay);

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    elements.forEach((element) => observer.observe(element));

    const fallbackDelay = 220;

    window.setTimeout(() => {
      elements.forEach((element) => element.classList.add("is-visible"));
    }, fallbackDelay);
  }

  function initParallax() {
    const elements = Array.from(document.querySelectorAll("[data-parallax]"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!elements.length || reduceMotion) {
      return;
    }

    let ticking = false;

    const updateParallax = () => {
      const viewportHeight = window.innerHeight;

      elements.forEach((element) => {
        const speed = Number(element.getAttribute("data-parallax") || "0.08");
        const rect = element.getBoundingClientRect();

        if (rect.bottom < 0 || rect.top > viewportHeight) {
          return;
        }

        const distanceFromCenter = rect.top + rect.height / 2 - viewportHeight / 2;
        const shift = Math.max(-36, Math.min(36, distanceFromCenter * -speed));
        element.style.setProperty("--parallax-shift", `${shift}px`);
      });

      ticking = false;
    };

    const requestTick = () => {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick);
  }

  function initFaq() {
    const items = Array.from(document.querySelectorAll("[data-faq-item]"));

    if (!items.length) {
      return;
    }

    const setClosed = (item) => {
      const button = item.querySelector("[data-faq-button]");
      const panel = item.querySelector("[data-faq-panel]");

      if (!button || !panel) {
        return;
      }

      button.setAttribute("aria-expanded", "false");
      item.classList.remove("is-open");
      panel.style.height = "0px";
      panel.setAttribute("aria-hidden", "true");
    };

    const setOpen = (item) => {
      const button = item.querySelector("[data-faq-button]");
      const panel = item.querySelector("[data-faq-panel]");

      if (!button || !panel) {
        return;
      }

      button.setAttribute("aria-expanded", "true");
      item.classList.add("is-open");
      panel.style.height = `${panel.scrollHeight}px`;
      panel.setAttribute("aria-hidden", "false");
    };

    items.forEach((item) => {
      const button = item.querySelector("[data-faq-button]");
      const panel = item.querySelector("[data-faq-panel]");

      if (!button || !panel) {
        return;
      }

      panel.hidden = false;
      setClosed(item);

      button.addEventListener("click", () => {
        const isExpanded = button.getAttribute("aria-expanded") === "true";

        items.forEach((otherItem) => {
          if (otherItem !== item) {
            setClosed(otherItem);
          }
        });

        if (isExpanded) {
          setClosed(item);
          return;
        }

        setOpen(item);
      });
    });

    window.addEventListener("resize", () => {
      items.forEach((item) => {
        const button = item.querySelector("[data-faq-button]");
        const panel = item.querySelector("[data-faq-panel]");

        if (!button || !panel) {
          return;
        }

        if (button.getAttribute("aria-expanded") === "true") {
          panel.style.height = `${panel.scrollHeight}px`;
        }
      });
    });
  }

  function initCompareCards() {
    const cards = Array.from(document.querySelectorAll("[data-compare-card]"));

    if (cards.length < 2) {
      return;
    }

    const activate = (target) => {
      cards.forEach((card) => {
        card.classList.toggle("is-active", card === target);
      });
    };

    const preset = cards.find((card) => card.classList.contains("is-active")) || cards[cards.length - 1];
    activate(preset);

    cards.forEach((card) => {
      ["mouseenter", "focusin", "touchstart"].forEach((eventName) => {
        card.addEventListener(eventName, () => activate(card), { passive: true });
      });
    });
  }

  function initDepthCards() {
    const cards = Array.from(document.querySelectorAll("[data-depth-card]"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!cards.length || reduceMotion) {
      return;
    }

    cards.forEach((card) => {
      const target = card.querySelector("[data-depth-target]") || card;

      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        const translateX = x * 10;
        const translateY = y * 8;

        target.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(1.025)`;
      });

      card.addEventListener("mouseleave", () => {
        target.style.transform = "";
      });
    });
  }

  function initContactForm() {
    const form = document.querySelector("[data-contact-form]");

    if (!form) {
      return;
    }

    const accessKeyField = form.querySelector('input[name="access_key"]');
    const subjectField = form.querySelector('input[name="subject"]');
    const fromNameField = form.querySelector('input[name="from_name"]');
    const intentField = form.querySelector('input[name="intent"]');
    const focusSelect = form.querySelector("[data-focus-select]");
    const status = form.querySelector("[data-form-status]");
    const submitButton = form.querySelector('button[type="submit"]');
    const submitLabel = submitButton ? submitButton.querySelector("[data-submit-label]") : null;
    const params = new URLSearchParams(window.location.search);
    const intent = params.get("intent");

    if (accessKeyField) {
      accessKeyField.value = config.contactForm.accessKey;
    }
    if (subjectField) {
      subjectField.value = config.contactForm.subject;
    }
    if (fromNameField) {
      fromNameField.value = config.contactForm.fromName;
    }
    if (intentField) {
      intentField.value = intent || "";
    }
    if (focusSelect) {
      focusSelect.innerHTML = '<option value="" selected disabled>Select focus area</option>' +
        config.contactForm.focusOptions
          .map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`)
          .join("");
    }

    if (intent === "audit") {
      const banner = document.querySelector("[data-intent-banner]");
      if (banner) {
        banner.textContent = "Free AI Presence Audit selected. Share what feels unclear, outdated, or easy to overlook in your current digital presence.";
        banner.classList.remove("hidden");
      }
      if (focusSelect) {
        focusSelect.value = "Free AI Presence Audit";
      }
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!form.reportValidity()) {
        return;
      }

      const honeypot = form.querySelector('input[name="botcheck"]');
      if (honeypot && honeypot.value) {
        return;
      }

      if (status) {
        status.className = "mt-4 text-sm text-on-surface-variant leading-relaxed";
        status.textContent = "";
      }

      if (config.contactForm.accessKey.startsWith("YOUR_")) {
        if (status) {
          status.className = "mt-4 text-sm leading-relaxed text-amber-700";
          status.textContent = config.contactForm.missingKeyMessage;
        }
        return;
      }

      const formData = new FormData(form);
      submitButton.disabled = true;
      submitButton.classList.add("opacity-70", "is-loading");

      try {
        const response = await fetch(config.contactForm.endpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: formData
        });

        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || config.contactForm.errorMessage);
        }

        form.reset();
        if (accessKeyField) {
          accessKeyField.value = config.contactForm.accessKey;
        }
        if (subjectField) {
          subjectField.value = config.contactForm.subject;
        }
        if (fromNameField) {
          fromNameField.value = config.contactForm.fromName;
        }
        if (focusSelect) {
          focusSelect.innerHTML = '<option value="" selected disabled>Select focus area</option>' +
            config.contactForm.focusOptions
              .map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`)
              .join("");
          if (intent === "audit") {
            focusSelect.value = "Free AI Presence Audit";
          }
        }
        if (intentField) {
          intentField.value = intent || "";
        }
        if (status) {
          status.className = "mt-4 text-sm leading-relaxed text-emerald-700";
          status.textContent = config.contactForm.successMessage;
        }
      } catch (error) {
        if (status) {
          status.className = "mt-4 text-sm leading-relaxed text-red-700";
          status.textContent = error.message || config.contactForm.errorMessage;
        }
      } finally {
        submitButton.disabled = false;
        submitButton.classList.remove("opacity-70", "is-loading");

        if (submitLabel) {
          submitLabel.textContent = "Send Inquiry";
        }
      }
    });
  }

  function escapeHtml(value) {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }
})();

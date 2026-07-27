(() => {
  const config = window.SITE_CONFIG || {};
  const showOrderButton = config.showOrderButton === true;
  const orderingRedirect = config.orderingPlatformRedirect !== false;
  const uzeatsEnabled = config.uzeats !== false;
  const heroStyle = config.heroStyle === "cover" ? "cover" : "collage";
  const orderUrl =
    config.orderUrl || "https://uzeats.com/restaurant/tikka-bar";
  const platformUrl = config.platformUrl || "https://uzeats.com";

  /* Hero layout: collage | cover */
  document.documentElement.classList.add(`hero-style-${heroStyle}`);
  const hero = document.querySelector(".hero");
  if (hero) {
    hero.classList.remove("hero--collage", "hero--cover");
    hero.classList.add(`hero--${heroStyle}`);
  }
  document.querySelectorAll("[data-hero-collage]").forEach((el) => {
    el.hidden = heroStyle !== "collage";
  });
  document.querySelectorAll("[data-hero-cover]").forEach((el) => {
    el.hidden = heroStyle !== "cover";
  });

  /* Apply ordering / UzEats feature flags */
  document.querySelectorAll("[data-order-cta]").forEach((el) => {
    if (!showOrderButton) {
      el.hidden = true;
      el.setAttribute("aria-hidden", "true");
      if (el.tagName === "A") el.remove();
      return;
    }

    if (el.tagName === "A") {
      if (orderingRedirect) {
        el.setAttribute("href", orderUrl);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener noreferrer");
      } else {
        el.removeAttribute("href");
        el.removeAttribute("target");
        el.removeAttribute("rel");
      }
    }

    if (!uzeatsEnabled && el.hasAttribute("data-uzeats-label")) {
      el.textContent = el.getAttribute("data-uzeats-label") || "Order Online";
    }
  });

  document.querySelectorAll("[data-uzeats]").forEach((el) => {
    if (!uzeatsEnabled) {
      el.hidden = true;
      el.setAttribute("aria-hidden", "true");
      if (el.tagName === "A") el.removeAttribute("href");
      return;
    }

    if (el.tagName === "A" && el.getAttribute("data-uzeats") === "platform") {
      el.setAttribute("href", platformUrl);
    }
  });

  document.querySelectorAll("[data-uzeats-fallback]").forEach((el) => {
    // Show non-UzEats copy when UzEats is off, or when order buttons are hidden
    el.hidden = uzeatsEnabled && showOrderButton;
  });

  if (!showOrderButton) {
    document.querySelectorAll("[data-order-section]").forEach((el) => {
      el.hidden = true;
    });
  }

  document.documentElement.classList.toggle("ordering-off", !showOrderButton);
  document.documentElement.classList.toggle("uzeats-off", !uzeatsEnabled);

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* Mobile nav */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  /* Menu tabs + view full menu */
  const menuSection = document.getElementById("menu");
  const tabs = document.querySelectorAll(".menu__tab");
  const panels = document.querySelectorAll(".menu__panel");
  const viewAllBtn = document.getElementById("menu-view-all");
  const orderLink = document.getElementById("menu-order-link");

  const showMenuTab = (id) => {
    const showAll = id === "all";
    tabs.forEach((t) => {
      const active = t.getAttribute("data-tab") === id;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", active ? "true" : "false");
    });
    panels.forEach((panel) => {
      const match = showAll || panel.getAttribute("data-panel") === id;
      panel.classList.toggle("is-active", match);
      panel.hidden = !match;
    });
    if (menuSection) menuSection.classList.toggle("is-showing-all", showAll);
    if (viewAllBtn) viewAllBtn.hidden = showAll;
    if (orderLink) {
      orderLink.hidden = !showAll || !showOrderButton;
    }
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      showMenuTab(tab.getAttribute("data-tab"));
    });
  });

  if (viewAllBtn) {
    viewAllBtn.addEventListener("click", () => {
      showMenuTab("all");
      menuSection?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  if (tabs.length) {
    const fromPage = document.body.getAttribute("data-menu-default");
    const menuDefaultTab =
      fromPage ||
      (typeof config.menuDefaultTab === "string" && config.menuDefaultTab
        ? config.menuDefaultTab
        : "all");
    showMenuTab(menuDefaultTab);
  }


  /* Sticky header shrink feel via scroll class */
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Scroll reveal */
  const revealEls = document.querySelectorAll(
    ".about__content, .about__collage, .categories__header, .categories__item, .menu-card, .highlight, .contact__header, .contact__panel, .experience__content",
  );

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    revealEls.forEach((el, i) => {
      el.classList.add("reveal");
      el.style.transitionDelay = `${Math.min(i % 4, 3) * 60}ms`;
      io.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }
})();

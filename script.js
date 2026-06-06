const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = [...document.querySelectorAll(".nav a")];
const revealItems = [...document.querySelectorAll(".reveal")];
const hoverGlowItems = [...document.querySelectorAll(".glass")];
const counters = [...document.querySelectorAll("[data-count]")];
const parallaxSections = [...document.querySelectorAll("[data-parallax]")];

const setHeaderState = () => {
  header?.classList.toggle("scrolled", window.scrollY > 18);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle?.addEventListener("click", () => {
  const open = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!open));
  nav?.classList.toggle("open", !open);
  document.body.classList.toggle("nav-open", !open);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navToggle?.setAttribute("aria-expanded", "false");
    nav?.classList.remove("open");
    document.body.classList.remove("nav-open");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in-view");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.16, rootMargin: "0px 0px -50px" }
);

revealItems.forEach((item) => revealObserver.observe(item));

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const counter = entry.target;
      const target = Number(counter.dataset.count);
      const start = performance.now();
      const duration = 950;

      const tick = (time) => {
        const progress = Math.min((time - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(counter);
    });
  },
  { threshold: 0.65 }
);

counters.forEach((counter) => counterObserver.observe(counter));

hoverGlowItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    const rect = item.getBoundingClientRect();
    item.style.setProperty("--x", `${event.clientX - rect.left}px`);
    item.style.setProperty("--y", `${event.clientY - rect.top}px`);
  });
});

document.querySelectorAll("[data-accordion]").forEach((accordion) => {
  const items = [...accordion.querySelectorAll(".accordion-item")];

  items.forEach((item) => {
    const trigger = item.querySelector(".accordion-trigger");
    const panel = item.querySelector(".accordion-panel");

    trigger?.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      items.forEach((otherItem) => {
        otherItem.classList.remove("is-open");
        otherItem.querySelector(".accordion-trigger")?.setAttribute("aria-expanded", "false");
        otherItem.querySelector(".accordion-panel")?.setAttribute("hidden", "");
      });

      if (!isOpen) {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
        panel?.removeAttribute("hidden");
      }
    });
  });
});

let ticking = false;
const updateParallax = () => {
  parallaxSections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const offset = Math.round(rect.top * -0.04);
    section.style.setProperty("--parallax-y", `${offset}px`);
  });
  ticking = false;
};

window.addEventListener(
  "scroll",
  () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateParallax);
  },
  { passive: true }
);

updateParallax();

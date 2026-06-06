const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = [...document.querySelectorAll(".nav a")];
const revealItems = [...document.querySelectorAll(".reveal")];
const interactiveCards = [...document.querySelectorAll(".tilt-card, .bento-card, .lane, .cta-card")];

const setHeaderState = () => {
  header.classList.toggle("scrolled", window.scrollY > 24);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle?.addEventListener("click", () => {
  const open = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!open));
  nav.classList.toggle("open", !open);
  document.body.classList.toggle("nav-open", !open);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navToggle?.setAttribute("aria-expanded", "false");
    nav.classList.remove("open");
    document.body.classList.remove("nav-open");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16, rootMargin: "0px 0px -40px" }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sections = [...document.querySelectorAll("main section[id]")];
const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { threshold: 0.34 }
);

sections.forEach((section) => activeObserver.observe(section));

interactiveCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 7;
    const rotateX = ((y / rect.height) - 0.5) * -7;
    card.style.setProperty("--x", `${x}px`);
    card.style.setProperty("--y", `${y}px`);

    if (card.classList.contains("tilt-card")) {
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    }
  });

  card.addEventListener("pointerleave", () => {
    if (card.classList.contains("tilt-card")) {
      card.style.transform = "";
    }
  });
});

const counter = document.querySelector("[data-count]");
let counted = false;

const countObserver = new IntersectionObserver(
  ([entry]) => {
    if (!entry.isIntersecting || counted || !counter) return;
    counted = true;
    const target = Number(counter.dataset.count);
    const start = performance.now();
    const duration = 900;

    const tick = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    countObserver.disconnect();
  },
  { threshold: 0.8 }
);

if (counter) countObserver.observe(counter);

const marqueeTrack = document.querySelector(".marquee-track");
if (marqueeTrack) {
  marqueeTrack.innerHTML += marqueeTrack.innerHTML;
}

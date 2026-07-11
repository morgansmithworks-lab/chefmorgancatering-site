const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const requestForm = document.querySelector("[data-request-form]");
const formStatus = document.querySelector("[data-form-status]");
const dateInput = document.querySelector('input[name="eventDate"]');
const requestRecipient = "chefmorgancatering@gmail.com";

const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
dateInput.min = today.toISOString().slice(0, 10);

document.querySelector("[data-year]").textContent = new Date().getFullYear();

const setHeader = () => header.classList.toggle("scrolled", window.scrollY > 20);
setHeader();
window.addEventListener("scroll", setHeader, { passive: true });

menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  menuButton.querySelector(".sr-only").textContent = open ? "Open menu" : "Close menu";
  mobileMenu.classList.toggle("open", !open);
  header.classList.toggle("menu-active", !open);
  document.body.classList.toggle("menu-open", !open);
});

mobileMenu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.querySelector(".sr-only").textContent = "Open menu";
  mobileMenu.classList.remove("open");
  header.classList.remove("menu-active");
  document.body.classList.remove("menu-open");
}));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .12, rootMargin: "0px 0px -40px" });

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 3, 2) * 55}ms`;
  revealObserver.observe(element);
});

requestForm.addEventListener("submit", event => {
  event.preventDefault();
  if (!requestForm.reportValidity()) return;

  const data = new FormData(requestForm);
  const values = Object.fromEntries(data.entries());
  const subject = `[Website date request] ${values.eventDate} — ${values.firstName} ${values.lastName}`;
  const body = [
    "NEW WEBSITE DATE REQUEST — REVIEW REQUIRED",
    "",
    `Name: ${values.firstName} ${values.lastName}`,
    `Email: ${values.email}`,
    `Preferred date: ${values.eventDate}`,
    `Guest count: ${values.guestCount}`,
    `Event type: ${values.eventType}`,
    `Location: ${values.location}`,
    "",
    "Event details:",
    values.details || "Not provided",
    "",
    "Status: Requested — not confirmed",
    "Client acknowledged that this request requires human review."
  ].join("\n");

  formStatus.textContent = "Your request is ready. Send the prepared email so Chef Morgan can review the date.";
  window.location.href = `mailto:${requestRecipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

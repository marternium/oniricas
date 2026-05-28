export function initNavbar() {
  const navbar =
    document.querySelector(".navbar");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      navbar.classList.remove("hidden");
    } else {
      navbar.classList.add("hidden");
    }
  });
}
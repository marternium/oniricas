export function initHoverEffects() {
  const hoverButtons =
    document.querySelectorAll("button");

  hoverButtons.forEach((button) => {
    button.addEventListener("mouseenter", () => {
      button.style.filter =
        "brightness(1.1)";
    });

    button.addEventListener("mouseleave", () => {
      button.style.filter =
        "brightness(1)";
    });
  });
}
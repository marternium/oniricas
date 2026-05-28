export function loadSettings(
  volumeSlider,
  autoplayToggle,
  muteButton
) {
  const settings = {
    volume: 1,
    autoplay: false,
    muted: false,
  };

  const savedVolume =
    localStorage.getItem("volume");

  const savedAutoplay =
    localStorage.getItem("autoplay");

  const savedMuted =
    localStorage.getItem("muted");

  if (savedVolume !== null) {
    settings.volume =
      parseFloat(savedVolume);

    volumeSlider.value = savedVolume;
  }

  if (savedAutoplay === "true") {
    settings.autoplay = true;

    autoplayToggle.checked = true;
  }

  if (savedMuted === "true") {
    settings.muted = true;

    muteButton.textContent = "🔇";

    volumeSlider.value = 0;
  }

  return settings;
}
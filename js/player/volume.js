export function initVolume({
  volumeSlider,
  muteButton,
  getCurrentAudio,
}) {
  let currentVolume =
    parseFloat(volumeSlider.value);

  // =========================
  // LOAD SETTINGS
  // =========================
  const savedVolume =
    localStorage.getItem("volume");

  const savedMuted =
    localStorage.getItem("muted");

  if (savedVolume !== null) {
    currentVolume =
      parseFloat(savedVolume);

    volumeSlider.value =
      currentVolume;
  }

  if (savedMuted === "true") {
    currentVolume = 0;

    volumeSlider.value = 0;

    muteButton.textContent = "🔇";
  }

  // =========================
  // VOLUME SLIDER
  // =========================
  volumeSlider.addEventListener(
    "input",
    () => {
      currentVolume =
        volumeSlider.value;

      localStorage.setItem(
        "volume",
        currentVolume
      );

      const audio =
        getCurrentAudio();

      if (audio) {
        audio.volume =
          currentVolume;
      }

      if (currentVolume == 0) {
        muteButton.textContent =
          "🔇";
      } else {
        muteButton.textContent =
          "🔊";
      }
    }
  );

  // =========================
  // MUTE BUTTON
  // =========================
  muteButton.addEventListener(
    "click",
    () => {
      if (currentVolume > 0) {
        volumeSlider.dataset.lastVolume =
          currentVolume;

        currentVolume = 0;

        volumeSlider.value = 0;

        muteButton.textContent =
          "🔇";
      } else {
        currentVolume =
          volumeSlider.dataset
            .lastVolume || 1;

        volumeSlider.value =
          currentVolume;

        muteButton.textContent =
          "🔊";
      }

      localStorage.setItem(
        "muted",
        currentVolume == 0
      );

      const audio =
        getCurrentAudio();

      if (audio) {
        audio.volume =
          currentVolume;
      }
    }
  );

  // =========================
  // API
  // =========================
  return {
    getVolume() {
      return currentVolume;
    },
  };
}
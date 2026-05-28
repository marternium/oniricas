import { formatTime }
from "../utils/format-time.js";

export function setupProgress({
  audio,
  progressSlider,
  currentTimeEl,
}) {
  // UPDATE
  audio.addEventListener(
    "timeupdate",
    () => {
      progressSlider.value =
        audio.currentTime;

      const progressPercent =
        (
          audio.currentTime /
          audio.duration
        ) * 100;

      progressSlider.style.setProperty(
        "--progress",
        `${progressPercent}%`
      );

      currentTimeEl.textContent =
        formatTime(audio.currentTime);
    }
  );

  // SEEK
  progressSlider.addEventListener(
    "input",
    () => {
      audio.currentTime =
        progressSlider.value;

      const progressPercent =
        (
          progressSlider.value /
          progressSlider.max
        ) * 100;

      progressSlider.style.setProperty(
        "--progress",
        `${progressPercent}%`
      );
    }
  );
}
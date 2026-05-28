import { formatTime }
  from "../utils/format-time.js";

import { setupProgress }
  from "./progress.js";

import { initVolume }
  from "./volume.js";

export function initPlayer({
  autoplayToggle,
  volumeSlider,
  muteButton,
}) {
  const audioCache = {};

  let currentAudio = null;

  let currentButton = null;

  let currentSong = null;

  let currentIndex = 0;

  // =========================
  // VOLUME
  // =========================
  const volume = initVolume({
    volumeSlider,
    muteButton,

    getCurrentAudio: () => currentAudio,
  });

  // =========================
  // PRECARGAR AUDIOS
  // =========================
  function preloadSongs() {
    const songs =
      document.querySelectorAll(".song");

    songs.forEach((song) => {
      const button =
        song.querySelector(".play");

      const audioSrc =
        button.dataset.audio;

      const durationEl =
        song.querySelector(".duration");

      const progressSlider =
        song.querySelector(
          ".progress-slider"
        );

      // evitar duplicados
      if (audioCache[audioSrc]) return;

      const audio = new Audio();

      audio.src = audioSrc;

      audio.preload = "metadata";

      audio.addEventListener(
        "loadedmetadata",
        () => {
          durationEl.textContent =
            formatTime(audio.duration);

          progressSlider.max =
            Math.floor(audio.duration);
        }
      );

      audioCache[audioSrc] = audio;
    });
  }

  // =========================
  // RESET PLAYER UI
  // =========================
  function resetPlayerUI() {
    document
      .querySelectorAll(".play")
      .forEach((btn) => {
        btn.textContent = "▶";
      });

    document
      .querySelectorAll(
        ".progress-slider"
      )
      .forEach((slider) => {
        slider.value = 0;

        slider.style.setProperty(
          "--progress",
          "0%"
        );
      });

    document
      .querySelectorAll(
        ".current-time"
      )
      .forEach((time) => {
        time.textContent = "0:00";
      });

    document
      .querySelectorAll(".song")
      .forEach((song) => {
        song.classList.remove(
          "active-song"
        );
      });
  }

  // =========================
  // PLAY SONG
  // =========================
  function playSong(index) {
    const songs =
      document.querySelectorAll(".song");

    const song = songs[index];

    if (!song) return;

    const button =
      song.querySelector(".play");

    const audioSrc =
      button.dataset.audio;

    const progressSlider =
      song.querySelector(
        ".progress-slider"
      );

    const currentTimeEl =
      song.querySelector(
        ".current-time"
      );

    // =========================
    // PAUSA
    // =========================
    if (
      currentAudio &&
      currentButton === button &&
      !currentAudio.paused
    ) {
      currentAudio.pause();

      button.textContent = "▶";

      return;
    }

    // =========================
    // REANUDAR
    // =========================
    if (
      currentAudio &&
      currentButton === button &&
      currentAudio.paused
    ) {
      currentAudio.play();

      button.textContent = "❚❚";

      return;
    }

    // =========================
    // DETENER ANTERIOR
    // =========================
    if (currentAudio) {
      currentAudio.pause();

      currentAudio.currentTime = 0;
    }

    resetPlayerUI();

    // =========================
    // AUDIO
    // =========================
    currentAudio =
      audioCache[audioSrc];

    currentAudio.volume =
      volume.getVolume();

    currentButton = button;

    currentSong = song;

    currentSong.classList.add(
      "active-song"
    );

    currentIndex = index;

    currentAudio.play();

    button.textContent = "❚❚";

    // =========================
    // PROGRESS
    // =========================
    setupProgress({
      audio: currentAudio,
      progressSlider,
      currentTimeEl,
    });

    // =========================
    // SONG END
    // =========================
    currentAudio.onended = () => {
      button.textContent = "▶";

      progressSlider.value = 0;

      progressSlider.style.setProperty(
        "--progress",
        "0%"
      );

      currentTimeEl.textContent =
        "0:00";

      currentSong.classList.remove(
        "active-song"
      );

      // AUTOPLAY
      if (
        autoplayToggle.checked
      ) {
        const songs =
          document.querySelectorAll(
            ".song"
          );

        const nextIndex =
          currentIndex + 1;

        if (
          nextIndex < songs.length
        ) {
          playSong(nextIndex);
        }
      }
    };
  }

  // =========================
  // SONG EVENTS
  // =========================
  function initSongEvents() {
    const playButtons =
      document.querySelectorAll(
        ".play"
      );

    playButtons.forEach(
      (button, index) => {
        button.addEventListener(
          "click",
          () => {
            playSong(index);
          }
        );
      }
    );
  }

  // =========================
  // LOAD AUTOPLAY
  // =========================
  const savedAutoplay =
    localStorage.getItem(
      "autoplay"
    );

  if (savedAutoplay === "true") {
    autoplayToggle.checked = true;
  }

  // =========================
  // AUTOPLAY STORAGE
  // =========================
  autoplayToggle.addEventListener(
    "change",
    () => {
      localStorage.setItem(
        "autoplay",
        autoplayToggle.checked
      );
    }
  );

  // =========================
  // INIT
  // =========================
  preloadSongs();

  initSongEvents();

  // =========================
  // PUBLIC API
  // =========================
  return {
    reload() {
      preloadSongs();

      initSongEvents();
    },

    stop() {
      if (currentAudio) {
        currentAudio.pause();

        currentAudio.currentTime = 0;
      }

      resetPlayerUI();
    },
  };
}
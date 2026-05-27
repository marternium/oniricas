function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";

  const mins = Math.floor(seconds / 60);

  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${mins}:${secs}`;
}

console.log("Las Oníricas loaded successfully ✨");

const hoverButtons = document.querySelectorAll("button");

const navbar = document.querySelector(".navbar");

const playButtons = document.querySelectorAll(".play");

const albums = document.querySelectorAll(".album");

const songs = document.querySelectorAll(".song");

const audioCache = {};

const autoplayToggle = document.getElementById("autoplay-toggle");

const volumeSlider = document.getElementById("volume-slider");

const muteButton = document.getElementById("mute-button");

let previousVolume = 1;

let isMuted = false;

let currentVolume = 1;

let currentAudio = null;

let currentButton = null;

let currentSong = null;

let currentIndex = 0;

// =========================
// LOAD SETTINGS
// =========================
const savedVolume =
  localStorage.getItem("volume");

const savedAutoplay =
  localStorage.getItem("autoplay");

const savedMuted =
  localStorage.getItem("muted");

if (savedVolume !== null) {
  currentVolume = parseFloat(savedVolume);

  volumeSlider.value = savedVolume;
}

if (savedAutoplay === "true") {
  autoplayToggle.checked = true;
}

if (savedMuted === "true") {
  isMuted = true;

  muteButton.textContent = "🔇";

  volumeSlider.value = 0;

  currentVolume = 0;
}

// =========================
// PRECARGAR DURACIONES
// =========================
songs.forEach((song) => {
  const button = song.querySelector(".play");

  const audioSrc = button.dataset.audio;

  const durationEl =
    song.querySelector(".duration");

  const progressSlider =
    song.querySelector(".progress-slider");

  const audio = new Audio();

  audio.src = audioSrc;

  audio.preload = "metadata";

  audio.addEventListener("loadedmetadata", () => {
    durationEl.textContent =
      formatTime(audio.duration);

    progressSlider.max =
      Math.floor(audio.duration);
  });

  audioCache[audioSrc] = audio;
});

// =========================
// HOVER BUTTONS
// =========================
hoverButtons.forEach((button) => {
  button.addEventListener("mouseenter", () => {
    button.style.filter = "brightness(1.1)";
  });

  button.addEventListener("mouseleave", () => {
    button.style.filter = "brightness(1)";
  });
});

// =========================
// PLAY SONG
// =========================
function playSong(index) {
  const visibleSongs = [...songs].filter(
    (song) => song.style.display !== "none",
  );

  const song = visibleSongs[index];

  if (!song) return;

  const button = song.querySelector(".play");

  const audioSrc = button.dataset.audio;

  const progressSlider =
    song.querySelector(".progress-slider");

  const currentTimeEl =
    song.querySelector(".current-time");

  const durationEl =
    song.querySelector(".duration");

  // SI YA ES LA MISMA CANCIÓN → PAUSA
  if (
    currentAudio &&
    currentButton === button &&
    !currentAudio.paused
  ) {
    currentAudio.pause();

    button.textContent = "▶";

    return;
  }

  // REANUDAR
  if (
    currentAudio &&
    currentButton === button &&
    currentAudio.paused
  ) {


    currentAudio.play();

    button.textContent = "❚❚";

    return;
  }

  // DETENER ANTERIOR
  if (currentAudio) {
    currentAudio.pause();

    currentAudio.currentTime = 0;
  }

  // RESET BOTONES
  playButtons.forEach((btn) => {
    btn.textContent = "▶";
  });

  // RESET BARRAS
  document.querySelectorAll(".progress-slider").forEach((slider) => {
    slider.value = 0;
    slider.style.setProperty("--progress", "0%");
  });

  document.querySelectorAll(".current-time").forEach((time) => {
    time.textContent = "0:00";
  });

  currentAudio = audioCache[audioSrc];

  currentAudio.volume = currentVolume;

  currentButton = button;

  currentSong = song;

  // SONG ACTIVE VISUAL
  songs.forEach((song) => {
    song.classList.remove("active-song");
  });

  currentSong.classList.add("active-song");

  currentIndex = index;

  currentAudio.play();

  button.textContent = "❚❚";

  // PROGRESO
  currentAudio.addEventListener("timeupdate", () => {
    progressSlider.value = currentAudio.currentTime;

    const progressPercent =
      (currentAudio.currentTime / currentAudio.duration) * 100;

    progressSlider.style.setProperty(
      "--progress",
      `${progressPercent}%`
    );

    currentTimeEl.textContent =
      formatTime(currentAudio.currentTime);
  });

  progressSlider.addEventListener("input", () => {
    currentAudio.currentTime =
      progressSlider.value;

    const progressPercent =
      (progressSlider.value / progressSlider.max) * 100;

    progressSlider.style.setProperty(
      "--progress",
      `${progressPercent}%`
    );
  });

  // FIN DE CANCIÓN
  currentAudio.addEventListener("ended", () => {
    button.textContent = "▶";

    document.querySelectorAll(".progress-slider").forEach((slider) => {
      slider.value = 0;
      slider.style.setProperty("--progress", "0%");
    });

    document.querySelectorAll(".current-time").forEach((time) => {
      time.textContent = "0:00";
    });

    // AUTOPLAY
    if (autoplayToggle.checked) {
      const nextIndex = currentIndex + 1;

      if (nextIndex < visibleSongs.length) {
        playSong(nextIndex);
      }
    }
  });
}

// =========================
// CLICK MANUAL
// =========================
playButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    const visibleSongs = [...songs].filter(
      (song) => song.style.display !== "none",
    );

    const clickedSong = button.closest(".song");

    const visibleIndex = visibleSongs.indexOf(clickedSong);

    playSong(visibleIndex);
  });
});

// =========================
// SCROLL DREAM TEAM
// =========================
document.querySelector(".primary").addEventListener("click", () => {
  document.querySelector("#dream-team").scrollIntoView({
    behavior: "smooth",
  });
});

// =========================
// SCROLL SOUNDTRACK
// =========================
document.querySelector(".secondary").addEventListener("click", () => {
  document.querySelector("#soundtrack").scrollIntoView({
    behavior: "smooth",
  });
});

// =========================
// NAVBAR
// =========================
window.addEventListener("scroll", () => {
  if (window.scrollY > 500) {
    navbar.classList.remove("hidden");
  } else {
    navbar.classList.add("hidden");
  }
});

// =========================
// ALBUM INICIAL
// =========================
songs.forEach((song) => {
  if (song.dataset.category === "pan-pocimas-mazmorras") {
    song.style.display = "flex";
  } else {
    song.style.display = "none";
  }
});

// =========================
// CLICK ALBUMS
// =========================
albums.forEach((album) => {
  album.addEventListener("click", () => {
    const selectedAlbum = album.dataset.album;

    // ACTIVE VISUAL
    albums.forEach((a) => {
      a.classList.remove("active");
    });

    album.classList.add("active");

    // DETENER AUDIO AL CAMBIAR DE ÁLBUM
    if (currentAudio) {
      currentAudio.pause();

      currentAudio.currentTime = 0;
    }

    playButtons.forEach((btn) => {
      btn.textContent = "▶";
    });

    document.querySelectorAll(".progress-slider").forEach((slider) => {
      slider.value = 0;
      slider.style.setProperty("--progress", "0%");
    });

    document.querySelectorAll(".current-time").forEach((time) => {
      time.textContent = "0:00";
    });

    // MOSTRAR CANCIONES
    songs.forEach((song) => {
      if (song.dataset.category === selectedAlbum) {
        song.style.display = "flex";
      } else {
        song.style.display = "none";
      }
    });
  });
});

// =========================
// VOLUME CONTROL
// =========================
volumeSlider.addEventListener("input", () => {
  currentVolume = volumeSlider.value;

  localStorage.setItem(
    "volume",
    currentVolume
  );

  if (currentAudio) {
    currentAudio.volume = currentVolume;
  }

  // CAMBIO ICONO
  if (currentVolume == 0) {
    muteButton.textContent = "🔇";

    isMuted = true;
  } else {
    muteButton.textContent = "🔊";

    isMuted = false;

    previousVolume = currentVolume;
  }
});

// =========================
// MUTE BUTTON
// =========================
muteButton.addEventListener("click", () => {
  if (isMuted) {
    currentVolume = previousVolume || 1;

    volumeSlider.value = currentVolume;

    muteButton.textContent = "🔊";

    isMuted = false;
    localStorage.setItem("muted", false);
  } else {
    previousVolume = volumeSlider.value;

    currentVolume = 0;

    volumeSlider.value = 0;

    muteButton.textContent = "🔇";

    isMuted = true;
    localStorage.setItem("muted", true);
  }

  if (currentAudio) {
    currentAudio.volume = currentVolume;
  }
});

// =========================
// AUTOPLAY SAVE
// =========================
autoplayToggle.addEventListener("change", () => {
  localStorage.setItem(
    "autoplay",
    autoplayToggle.checked
  );
});
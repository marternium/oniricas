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

const audioCache = {};

const autoplayToggle = document.getElementById("autoplay-toggle");

const volumeSlider = document.getElementById("volume-slider");

const muteButton = document.getElementById("mute-button");

const albumsData = [
  {
    id: "pan-pocimas-mazmorras",
    title: "Pan, Pócimas y Mazmorras",
    cover: "assets/img/PanPocimasMazmorras.png",

    songs: [
      "Chadalid - El Último Capitán",
      "Girasol Hambriento - El Rey del Sembradío",
      "Mob Lasponja - Terror del Arenal",
      "Jalató Real - El Rey del Corral",
      "Escarajefe Dorado - Coraza Brillante",
      "Batofu - Alas Negras",
      "Boostacho - La Mansión Encantada",
      "Chafer Ronin - Último Duelo",
      "Blatarata - Mundo Diminuto",
      "Director Grunob - Clase de Supervivencia",
      "Bworka - La Más Fuerte",
      "Cofrerrero - Konnichiwa Bajo Tierra",
      "Shin Larva - Bajo la Montaña",
      "Coralador Magistral - No te Acerques",
      "Kwoknan - El Nido Elemental",
      "Rakooper - Refugio Silvestre",
    ],
  },

  {
    id: "wipes-kamas-mazmorras",
    title: "Wipes, Kamas y Mazmorras",
    cover: "assets/img/WipesKamasMazmorras.png",

    songs: [
      "Wey Wabbit - El Reino de las Zanahowias",
      "Kaníbola Daldrrak - Rituales de Moon",
      "La Corte de los Blops Reales",
      "Gelatinas reales - Reino de Azúcar y Guerra",
      "Nelwynn - Humo en los Pulmones",
      "Los Toneles de Gurlo",
      "Crujidor Legendario - Corazón de Granito",
      "Dragenerys - Hijos del Fuego",
    ],
  },
];

const albumsContainer =
  document.getElementById("albums-container");

const songsContainer =
  document.getElementById("songs-container");

function renderAlbums() {
  albumsContainer.innerHTML = "";

  albumsData.forEach((album, index) => {
    const albumElement =
      document.createElement("div");

    albumElement.classList.add("album");

    if (index === 0) {
      albumElement.classList.add("active");
    }

    albumElement.dataset.album = album.id;

    albumElement.innerHTML = `
      <div class="album-cover">
        <img src="${album.cover}" alt="${album.title}" />
      </div>

      <div>
        <h4>${album.title}</h4>
        <small>Las Oníricas</small>
      </div>
    `;

    albumsContainer.appendChild(albumElement);
  });
}

function renderSongs(albumId) {
  songsContainer.innerHTML = "";

  const album = albumsData.find((a) => a.id === albumId);

  album.songs.forEach((songName, index) => {
    const songElement = document.createElement("div");
    songElement.classList.add("song");
    songElement.dataset.category = album.id;

    const audioPath = `assets/audio/${album.id}/${songName}.mp3`;

    songElement.innerHTML = `
      <div class="song-left">
        <div class="song-info">
          <small>
            ${String(index + 1).padStart(2, "0")} • ${album.title}
          </small>

          <h3>${songName}</h3>

          <div class="player-progress">
            <span class="current-time">0:00</span>
            <input type="range" class="progress-slider" min="0" max="100" value="0" />
            <span class="duration">0:00</span>
          </div>
        </div>
      </div>

      <button class="play" data-audio="${audioPath}">▶</button>
    `;

    songsContainer.appendChild(songElement);

    // 🔥 AQUÍ ESTÁ LA MAGIA
    const audio = new Audio(audioPath);
    audio.preload = "metadata";

    const durationEl = songElement.querySelector(".duration");
    const progressSlider = songElement.querySelector(".progress-slider");

    audio.addEventListener("loadedmetadata", () => {
      durationEl.textContent = formatTime(audio.duration);
      progressSlider.max = Math.floor(audio.duration);
    });

    audioCache[audioPath] = audio;
  });
}

renderAlbums();

renderSongs(albumsData[0].id);

const albums = document.querySelectorAll(".album");

function getSongs() {
  return document.querySelectorAll(".song");
}

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
document.querySelectorAll(".song").forEach((song) => {
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
  const visibleSongs = [...getSongs()].filter(
    (song) => song.style.display !== "none"
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

    document.querySelectorAll(".play").forEach((btn) => {
      btn.textContent = "▶";
    });

    const activeButton = document.querySelector(
      `.play[data-audio="${audioSrc}"]`
    );

    if (activeButton) {
      activeButton.textContent = "❚❚";
    }

    return;
  }

  // DETENER ANTERIOR
  if (currentAudio) {
    currentAudio.pause();

    currentAudio.currentTime = 0;
  }

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
  document.querySelectorAll(".song").forEach((song) => {
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
songsContainer.addEventListener("click", (e) => {
  const button = e.target.closest(".play");
  if (!button) return;

  const songElement = button.closest(".song");

  const visibleSongs = [...getSongs()].filter(
    (song) => song.style.display !== "none"
  );

  const index = visibleSongs.indexOf(songElement);

  playSong(index);
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
document.querySelectorAll(".song").forEach((song) => {
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
    albums.forEach((a) => a.classList.remove("active"));
    album.classList.add("active");

    // STOP AUDIO
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    // RESET UI
    document.querySelectorAll(".progress-slider").forEach((slider) => {
      slider.value = 0;
      slider.style.setProperty("--progress", "0%");
    });

    document.querySelectorAll(".current-time").forEach((time) => {
      time.textContent = "0:00";
    });

    // 🔥 RE RENDER
    renderSongs(selectedAlbum);

    // 💣 IMPORTANTE: RE-SINCRONIZAR BOTÓN ACTIVO
    if (currentAudio) {
      setTimeout(() => {
        const activeButton = document.querySelector(
          `.play[data-audio="${currentAudio.src.split("/assets")[1] ? currentAudio.dataset?.audio : ""}"]`
        );

        // fallback seguro (más confiable)
        document.querySelectorAll(".play").forEach((btn) => {
          btn.textContent = "▶";
        });

        const realButton = document.querySelector(
          `.play[data-audio="${Object.keys(audioCache).find(
            (k) => audioCache[k] === currentAudio
          )}"]`
        );

        if (realButton) {
          realButton.textContent = "❚❚";
        }
      }, 0);
    }
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
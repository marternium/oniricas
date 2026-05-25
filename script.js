console.log("Las Oníricas loaded successfully ✨");

const hoverButtons = document.querySelectorAll("button");

const navbar = document.querySelector(".navbar");

const playButtons = document.querySelectorAll(".play");

let currentAudio = null;

let currentIndex = 0;

// HOVER BUTTONS
hoverButtons.forEach((button) => {
  button.addEventListener("mouseenter", () => {
    button.style.filter = "brightness(1.1)";
  });

  button.addEventListener("mouseleave", () => {
    button.style.filter = "brightness(1)";
  });
});

// MUSIC PLAYER
function playSong(index) {
  const visibleSongs = [...songs].filter(
    (song) => song.style.display !== "none",
  );

  const song = visibleSongs[index];

  if (!song) return;

  const button = song.querySelector(".play");

  const audioSrc = button.dataset.audio;

  const progressBar = song.querySelector(".progress-bar");

  // detener canción anterior
  if (currentAudio) {
    currentAudio.pause();
  }

  // reset barras
  document.querySelectorAll(".progress-bar").forEach((bar) => {
    bar.style.width = "0%";
  });

  currentAudio = new Audio(audioSrc);

  currentAudio.play();

  // actualizar barra
  currentAudio.addEventListener("timeupdate", () => {
    const progress = (currentAudio.currentTime / currentAudio.duration) * 100;

    progressBar.style.width = progress + "%";
  });

  // autoplay siguiente
  currentAudio.addEventListener("ended", () => {
    currentIndex++;

    if (currentIndex < visibleSongs.length) {
      playSong(currentIndex);
    }
  });
}

// clicks manuales
playButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    currentIndex = index;

    playSong(currentIndex);
  });
});

// SCROLL DREAM TEAM
document.querySelector(".primary").addEventListener("click", () => {
  document.querySelector("#dream-team").scrollIntoView({
    behavior: "smooth",
  });
});

// SCROLL SOUNDTRACK
document.querySelector(".secondary").addEventListener("click", () => {
  document.querySelector("#soundtrack").scrollIntoView({
    behavior: "smooth",
  });
});

// NAVBAR
window.addEventListener("scroll", () => {
  if (window.scrollY > 500) {
    navbar.classList.remove("hidden");
  } else {
    navbar.classList.add("hidden");
  }
});

const albums = document.querySelectorAll(".album");

const songs = document.querySelectorAll(".song");

// mostrar solo pan-pocimas-mazmorras al inicio
songs.forEach((song) => {
  if (song.dataset.category === "pan-pocimas-mazmorras") {
    song.style.display = "flex";
  } else {
    song.style.display = "none";
  }
});

// click albums
albums.forEach((album) => {
  album.addEventListener("click", () => {
    const selectedAlbum = album.dataset.album;

    // active visual
    albums.forEach((a) => {
      a.classList.remove("active");
    });

    album.classList.add("active");

    // mostrar canciones correctas
    songs.forEach((song) => {
      if (song.dataset.category === selectedAlbum) {
        song.style.display = "flex";
      } else {
        song.style.display = "none";
      }
    });
  });
});

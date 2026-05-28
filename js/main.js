import { albumsData }
from "./data/albums.js";

import { renderAlbums }
from "./ui/albums-ui.js";

import { renderSongs }
from "./ui/songs-ui.js";

import { initNavbar }
from "./ui/navbar.js";

import { initHoverEffects }
from "./ui/hover-effects.js";

import { initPlayer }
from "./player/player.js";

const albumsContainer =
  document.getElementById(
    "albums-container"
  );

const songsContainer =
  document.getElementById(
    "songs-container"
  );

const autoplayToggle =
  document.getElementById(
    "autoplay-toggle"
  );

const volumeSlider =
  document.getElementById(
    "volume-slider"
  );

const muteButton =
  document.getElementById(
    "mute-button"
  );

// RENDER
renderAlbums(
  albumsContainer,
  albumsData
);

renderSongs(
  songsContainer,
  albumsData[0]
);

// UI
initNavbar();

initHoverEffects();

// PLAYER
const player = initPlayer({
  autoplayToggle,
  volumeSlider,
  muteButton,
});
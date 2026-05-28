import { renderSongs }
from "../ui/songs-ui.js";

const songsContainer =
  document.getElementById(
    "songs-container"
  );

export function renderAlbums(
  albumsContainer,
  albumsData
) {
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

    albumElement.addEventListener("click", () => {
      const activeAlbumElement =
        albumsContainer.querySelector(".album.active");

      if (activeAlbumElement) {
        activeAlbumElement.classList.remove("active");
      }

      albumElement.classList.add("active");

      renderSongs(songsContainer, album);
    });

    albumsContainer.appendChild(albumElement);
  });
}
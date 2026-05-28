export function renderSongs(
  songsContainer,
  album
) {
  songsContainer.innerHTML = "";

  album.songs.forEach((songName, index) => {
    const songElement =
      document.createElement("div");

    songElement.classList.add("song");

    const audioPath =
      `assets/audio/${album.id}/${songName}.mp3`;

    songElement.innerHTML = `
      <div class="song-left">
        <div class="song-info">

          <small>
            ${String(index + 1).padStart(2, "0")}
            • ${album.title}
          </small>

          <h3>${songName}</h3>

          <div class="player-progress">
            <span class="current-time">0:00</span>

            <input
              type="range"
              class="progress-slider"
              min="0"
              max="100"
              value="0"
            />

            <span class="duration">0:00</span>
          </div>
        </div>
      </div>

      <button
        class="play"
        data-audio="${audioPath}"
      >
        ▶
      </button>
    `;

    songsContainer.appendChild(songElement);
  });
}
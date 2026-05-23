console.log('Las Oníricas loaded successfully ✨');

const hoverButtons =
  document.querySelectorAll('button');

const navbar =
  document.querySelector('.navbar');

const playButtons =
  document.querySelectorAll('.play');

let currentAudio = null;


// HOVER BUTTONS
hoverButtons.forEach(button => {

  button.addEventListener('mouseenter', () => {
    button.style.filter = 'brightness(1.1)';
  });

  button.addEventListener('mouseleave', () => {
    button.style.filter = 'brightness(1)';
  });

});


// MUSIC PLAYER
playButtons.forEach(button => {

  button.addEventListener('click', () => {

    const audioSrc =
      button.dataset.audio;

    const song =
      button.closest('.song');

    const progressBar =
      song.querySelector('.progress-bar');

    // detener canción anterior
    if (currentAudio) {
      currentAudio.pause();
    }

    currentAudio =
      new Audio(audioSrc);

    currentAudio.play();

    // actualizar barra
    currentAudio.addEventListener(
      'timeupdate',
      () => {

        const progress =
          (currentAudio.currentTime /
           currentAudio.duration) * 100;

        progressBar.style.width =
          progress + '%';

      }
    );

  });

});


// SCROLL DREAM TEAM
document.querySelector('.primary')
  .addEventListener('click', () => {

    document.querySelector('#dream-team')
      .scrollIntoView({
        behavior: 'smooth'
      });

});


// SCROLL SOUNDTRACK
document.querySelector('.secondary')
  .addEventListener('click', () => {

    document.querySelector('#soundtrack')
      .scrollIntoView({
        behavior: 'smooth'
      });

});


// NAVBAR
window.addEventListener('scroll', () => {

  if (window.scrollY > 500) {
    navbar.classList.remove('hidden');
  } else {
    navbar.classList.add('hidden');
  }

});
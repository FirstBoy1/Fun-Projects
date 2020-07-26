const img = document.querySelector('.music-image');
const title = document.querySelector('.title');
const artist = document.querySelector('.artist');
const music = document.querySelector('.music');
const progress = document.querySelector('.progress');
const progressContainer = document.querySelector('.progress-container');
const currentTimeEl = document.querySelector('#current-time');
const durationEl = document.querySelector('#duration');
const prevBtn = document.querySelector('#prev');
const playPuaseBtn = document.querySelector('#play-pause');
const nextBtn = document.querySelector('#next');

const songs = [
  {
    name: 'jacinto-1',
    displayName: 'Electric Chill Machine',
    artist: 'Jacinto Design',
  },
  {
    name: 'Unreleased Apsara Aali Vs Cradless Vs INCREDIBLE DJ Prince Kolhapur',
    displayName: 'Unknown',
    artist: 'Unknown',
  },
  {
    name: 'jacinto-2',
    displayName: 'Seven Nation Army (Remix)',
    artist: 'Jacinto Design',
  },
  {
    name: 'jacinto-3',
    displayName: 'Goodnight, Disco Queen',
    artist: 'Jacinto Design',
  },
  {
    name: 'metric-1',
    displayName: 'Front Row (Remix)',
    artist: 'Metric/Jacinto Design',
  },
];

let isPlaying = false;
let songIndex = 0;

function playSong() {
  isPlaying = true;
  playPuaseBtn.classList.replace('fa-play', 'fa-pause');
  playPuaseBtn.setAttribute('title', 'Pause');
  music.play();
}

function pauseSong() {
  isPlaying = false;
  playPuaseBtn.classList.replace('fa-pause', 'fa-play');
  playPuaseBtn.setAttribute('title', 'Play');
  music.pause();
}

function setDurationCurrentTime(duration, currentTime) {
  const durationMinutes = Math.floor(duration / 60);
  let durationSeconds = Math.floor(duration % 60);

  if (durationSeconds < 10) durationSeconds = `0${durationSeconds}`;

  durationEl.textContent = `${durationMinutes}:${durationSeconds}`;

  const currentMinutes = Math.floor(currentTime / 60);
  let currentSeconds = Math.floor(currentTime % 60);

  if (currentSeconds < 10) currentSeconds = `0${currentSeconds}`;
  currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
}

function updateProgressBar() {
  const { duration, currentTime } = this;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
  setDurationCurrentTime(duration, currentTime);
}

function updateGoogleMediaControls(title, artist, img) {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist,
      album: 'ALBUM',
      artwork: [
        {
          sizes: '320x180', // <- MUST BE EXACTLY!
          src: img,
          type: '',
        },
      ],
    });
  }
}

function loadSong(song) {
  title.textContent = song.displayName;
  artist.textContent = song.artist;
  music.src = `music/${song.name}.mp3`;
  img.src = `images/${song.name}.jpg`;
  music.onloadeddata = () =>
    setDurationCurrentTime(music.duration, music.currentTime);
  updateGoogleMediaControls(
    song.displayName,
    song.artist,
    `images/${song.name}.jpg`
  );
}

function nextSong() {
  songIndex++;
  if (songIndex > songs.length - 1) songIndex = 0;
  loadSong(songs[songIndex]);
  playSong();
}

function prevSong() {
  songIndex--;
  if (songIndex < 0) songIndex = songs.length - 1;
  loadSong(songs[songIndex]);
  playSong();
}

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const { duration } = music;
  music.currentTime = (clickX / width) * duration;
}

// On load - select First song
loadSong(songs[songIndex]);

music.addEventListener('timeupdate', updateProgressBar);
music.addEventListener('ended', nextSong);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
progressContainer.addEventListener('click', setProgress);
document.addEventListener('keydown', (e) => {
  if (e.keyCode === 32) isPlaying ? pauseSong() : playSong();
  if (e.keyCode === 39) nextSong();
  if (e.keyCode === 37) prevSong();
});
playPuaseBtn.addEventListener('click', () =>
  isPlaying ? pauseSong() : playSong()
);

if ('mediaSession' in navigator) {
  navigator.mediaSession.setActionHandler('play', playSong);
  navigator.mediaSession.setActionHandler('pause', pauseSong);
  navigator.mediaSession.setActionHandler('previoustrack', prevSong);
  navigator.mediaSession.setActionHandler('nexttrack', nextSong);
}

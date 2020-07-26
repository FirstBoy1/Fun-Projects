const videoContainer = document.querySelector('.video-container');
const video = document.querySelector('#video');
const progressWrapper = document.querySelector('.progress-wrapper');
const progress = document.querySelector('.progress');
const playPauseButton = document.querySelector('#play-pause');
const volumeIcon = document.querySelector('#volume');
const volumeBarWrapper = document.querySelector('.volume-bar-wrapper');
const volumeBar = document.querySelector('.volume-bar');
const currentTimeEl = document.querySelector('#current-time');
const durationEl = document.querySelector('#duration');
const speedEl = document.querySelector('#speed');
const fullscreenIcon = document.querySelector('#fullscreen');
const controlsEl = document.querySelector('.controls');

let isPlaying = false;

function play() {
  isPlaying = true;
  playPauseButton.classList.replace('fa-play', 'fa-pause');
  playPauseButton.setAttribute('title', 'Pause');
  video.play();
  controlsEl.classList.remove('show');
}

function pause() {
  isPlaying = false;
  playPauseButton.classList.replace('fa-pause', 'fa-play');
  playPauseButton.setAttribute('title', 'Play');
  video.pause();
  controlsEl.classList.add('show');
}

function togglePlayPause() {
  isPlaying ? pause() : play();
}

function updateProgress() {
  const { currentTime, duration } = this;
  const calculatedProgress = Math.floor((currentTime / duration) * 100);
  progress.style.width = `${calculatedProgress}%`;

  const currentMinutes = Math.floor(currentTime / 60);
  let currentSeconds = Math.floor(currentTime % 60);
  if (currentSeconds < 10) currentSeconds = `0${currentSeconds}`;

  const durationMinutes = Math.floor(duration / 60);
  let durationSeconds = Math.floor(duration % 60);
  if (durationSeconds < 10) durationSeconds = `0${durationSeconds}`;

  currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
  durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
}

function setProgress(e) {
  const clickX = e.offsetX;
  const width = this.clientWidth;
  const { duration } = video;
  video.currentTime = (clickX / width) * duration;
}

let isVolumeMouseDown = false;

function setVolume(e) {
  const volumeDuration = 1;
  if (this.volume !== undefined) {
    volumeBar.style.width = `${(this.volume / volumeDuration) * 100}%`;
    const className = volumeIcon.className.split(' ')[0];
    if (this.volume >= 0.5 && this.volume <= 1)
      volumeIcon.className = className + ' fa-volume-up';
    else if (this.volume >= 0.1 && this.volume < 0.5)
      volumeIcon.className = className + ' fa-volume-down';
    else if (this.volume >= 0)
      volumeIcon.className = className + ' fa-volume-mute';
    if (video.muted) {
      volumeIcon.className = className + ' fa-volume-mute';
      volumeBar.style.width = '0';
    }
  } else {
    const clickX = e.offsetX;
    const width = this.clientWidth;
    const calculatedVolume =
      Math.round((clickX / width) * volumeDuration * 10) / 10;
    console.log(calculatedVolume);
    video.volume = calculatedVolume;
  }
}

function updateVolumeBar(e) {
  if (!isVolumeMouseDown) return;
  setVolume.call(this, e);
  console.log('mouse move');
}

function handleVolumeMouseUp() {
  isVolumeMouseDown = false;
  volumeBar.style.width = '100%';
  console.log('mouse up');
}

function handleVolumeMouseDown() {
  isVolumeMouseDown = true;
  volumeBar.style.width = '0';
  console.log('mouse down');
}

let isFullScreen = false;

function openFullScreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    /* Firefox */
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    /* IE/Edge */
    element.msRequestFullscreen();
  }
}

function exitFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE/Edge */
    document.msExitFullscreen();
  }
}

function toggleFullScreen() {
  !isFullScreen ? openFullScreen(videoContainer) : exitFullScreen();
  isFullScreen = !isFullScreen;
}

function toggleVolumeMute() {
  video.muted = !video.muted;
}

let playbackIndex = 2;
const speedValues = [0.5, 0.75, 1.0, 1.5, 2.0];

function handleKeyEvents(e) {
  const keyCode = e.keyCode;
  switch (keyCode) {
    case 32:
      togglePlayPause();
      break;
    case 70:
      toggleFullScreen();
      break;
    case 77:
      toggleVolumeMute();
      break;
    case 67:
      if (playbackIndex === speedValues.length - 1) break;
      playbackIndex++;
      handlePlayback(speedValues[playbackIndex]);
      break;
    case 88:
      if (playbackIndex === 0) break;
      playbackIndex--;
      handlePlayback(speedValues[playbackIndex]);
      break;
    case 39:
      if (video.currentTime + 5 > video.duration) break;
      video.currentTime += 5;
      break;
    case 37:
      if (video.currentTime - 5 < 0) return (video.currentTime = 0);
      video.currentTime -= 5;
      break;
    case 38: //up
      if (video.volume + 0.25 >= 1) return (video.volume = 1);
      video.volume += 0.25;
      break;
    case 40: //down
      if (video.volume - 0.25 <= 0) return (video.volume = 0);
      video.volume -= 0.25;
      break;
  }
}

function handlePlayback(value) {
  video.playbackRate = value || this.value;
}

function handleRateChange() {
  speedEl.selectedIndex = speedValues.findIndex(
    (value) => value == this.playbackRate
  );
}

function showControls() {
  videoContainer.style.cursor = 'default';
  if (video.paused || this.querySelector(':hover') === controlsEl) return;
  setTimeout(() => controlsEl.classList.add('show-animated'), 0);
}

function handleAnimationEnd() {
  videoContainer.style.cursor = 'none';
  controlsEl.classList.remove('show-animated');
}

playPauseButton.addEventListener('click', togglePlayPause);
video.addEventListener('timeupdate', updateProgress);
video.addEventListener('click', togglePlayPause);
video.addEventListener('volumechange', setVolume);
fullscreenIcon.addEventListener('click', toggleFullScreen);
progressWrapper.addEventListener('click', setProgress);
volumeBarWrapper.addEventListener('click', setVolume);
document.addEventListener('keydown', handleKeyEvents);
volumeIcon.addEventListener('click', toggleVolumeMute);
speedEl.addEventListener('change', handlePlayback);
video.addEventListener('ratechange', handleRateChange);
videoContainer.addEventListener('mousemove', showControls);
videoContainer.addEventListener('animationend', handleAnimationEnd);

// test
// volumeBarWrapper.addEventListener('mousedown', handleVolumeMouseDown);
// volumeBarWrapper.addEventListener('mousemove', updateVolumeBar);
// volumeBarWrapper.addEventListener('mouseup', handleVolumeMouseUp);

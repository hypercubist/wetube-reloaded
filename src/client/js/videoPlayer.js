const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const volumeBtn = document.getElementById("mute");
const volumeBtnIcon = volumeBtn.querySelector("i");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("volume");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let volumeValue = 0.5;
let controlsTimeout = null;
let controlsMovementTimeout = null;
video.volume = volumeValue;

const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(14, 5);

const togglePlay = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const toggleMute = (e) => {
  if (video.muted) {
    video.muted = false;
    volumeRange.value = volumeValue;
    volumeBtnIcon.classList = "fas fa-volume-up";
  } else {
    video.muted = true;
    volumeRange.value = 0;
    volumeBtnIcon.classList = "fas fa-volume-mute";
  }
};

const handlePlayBtn = (e) => {
  togglePlay(e);
};

const handleVideoClick = (e) => {
  togglePlay(e);
};

const handleVolumeBtn = (e) => {
  toggleMute(e);
};

const handleVolumeRange = (e) => {
  const {
    target: { value },
  } = e;
  video.volume = volumeValue = value;
};

const handleVolumeChange = (e) => {
  if (video.muted) {
    video.muted = false;
    volumeBtnIcon.classList = "fas fa-volume-mute";
  }
  if (video.volume === 0) {
    volumeBtnIcon.classList = "fas fa-volume-off";
  } else {
    volumeBtnIcon.classList = "fas fa-volume-up";
  }
};

const handleLoadedData = () => {
  console.log("video is loaded");
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (e) => {
  const {
    target: { value },
  } = e;
  video.currentTime = value;
};

const handleVideoEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/video/${id}/view`, {
    method: "POST",
  });
  playBtnIcon.classList = "fas fa-play";
};

const handleFullScreenClick = () => {
  const fullScreen = document.fullscreenElement;
  if (fullScreen) {
    document.exitFullscreen();
  } else {
    videoContainer.requestFullscreen();
  }
};

const handleFullScreenChange = () => {
  const fullScreen = document.fullscreenElement;
  if (fullScreen) {
    fullScreenIcon.classList = "fas fa-compress";
  } else {
    fullScreenIcon.classList = "fas fa-expand";
  }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
};

const handleKeyDown = (e) => {
  if (e.target.nodeName === "BODY") {
    switch (e.keyCode) {
      case 70: //F
        video.requestFullscreen();
        break;
      case 32: //space
        togglePlay(e);
        break;
      case 77: //M
        toggleMute(e);
        break;
      case 38: //↑
        e.preventDefault();
        if (video.volume < 1) {
          video.volume = (video.volume * 10 + 1) / 10;
          volumeValue = volumeRange.value = video.volume;
        }
        break;
      case 40: //↓
        e.preventDefault();
        if (video.volume > 0) {
          video.volume = (video.volume * 10 - 1) / 10;
          volumeValue = volumeRange.value = video.volume;
        }
        break;
      // case 37: //←
      //   e.preventDefault();
      //   timeline.value -= 2;
      //   break;
      // case 39: //→
      //   e.preventDefault();
      //   timeline.value += 2;
      //   break;
      default:
        return;
    }
  }
};

const init = () => {
  video.load();
};
playBtn.addEventListener("click", handlePlayBtn);
video.addEventListener("click", handleVideoClick);
volumeBtn.addEventListener("click", handleVolumeBtn);
video.addEventListener("volumechange", handleVolumeChange);
volumeRange.addEventListener("input", handleVolumeRange);
video.addEventListener("loadeddata", handleLoadedData);
timeline.addEventListener("input", handleTimelineChange);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleVideoEnded);
fullScreenBtn.addEventListener("click", handleFullScreenClick);
document.addEventListener("fullscreenchange", handleFullScreenChange);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
document.addEventListener("keydown", handleKeyDown);

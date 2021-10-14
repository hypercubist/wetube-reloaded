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

const handlePlayClick = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMute = (e) => {
  if (video.muted) {
    video.muted = false;
    volumeRange.value = volumeValue
    volumeBtn.className = "fas fa-volume-up";
  } else {
    video.muted = true;
    volumeRange.value = 0;
    volumeBtn.className = "fas fa-volume-mute"
  }
};

const handleVolume = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    volumeBtn.className = "fas fa-volume-mute"
  }
  if(value ==="0"){
    volumeBtn.className = "fas fa-volume-off";
  }else{
    volumeBtn.className = "fas fa-volume-up";
  }
  video.volume = volumeValue = value;
};

const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(14, 5);

const handleLoadedData = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullScreenClick = () => {
  const fullScreen = document.fullscreenElement;
  if (fullScreen) {
    document.exitFullscreen();
  } else {
    videoContainer.requestFullscreen();
  }
};

const handleFullScreenChange =()=>{
  const fullScreen = document.fullscreenElement;
  if(fullScreen){
    fullScreenIcon.classList = "fas fa-expand";
  }else{
    fullScreenIcon.classList = "fas fa-compress";
  }
}

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

const handleVideoEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/video/${id}/view`, {
    method: "POST",
  });
  playBtnIcon.classList = "fas fa-play";
};

const handleKeyDown =(event)=>{
  if(event.key === "f"){
    video.requestFullscreen();
  }else if(event.key === "escape"){
    document.exitFullscreen();
  }else if(event.key === "space"){
    handlePlayClick();//event넘겨줘야하는지?
  }else return;
}

playBtn.addEventListener("click", handlePlayClick);
volumeBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolume);
video.addEventListener("loadeddata", handleLoadedData);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreenClick);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
video.addEventListener("ended", handleVideoEnded);
video.addEventListener("keydown", handleKeyDown)
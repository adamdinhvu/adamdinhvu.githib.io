

/* 
    I imagine this website is for a DJ, so functionality is the least of their concern. The point of this website is to show off how cool they are
    I had some fun with the styling and layout, because I think that would be appropiatte for this context

    I removed the weird VCR controls that were here before and added a modern scrubber, it made nost of the old control redundant so i removed them
    I chose a volume slider because most modern media players have that
*/


let media = document.getElementById("media");
let controls = document.getElementsByClassName("controls")[0];

let play = document.getElementsByClassName("play")[0];

let timerWrapper = document.getElementsByClassName("timer")[0];
let timer = document.getElementsByClassName("timer-span")[0];

let mute = document.getElementsByClassName("mute")[0];

let scrubber = document.getElementsByClassName("scrubber")[0];
let isScrubbing = false;

let loadingImgs = document.getElementsByClassName("loading");

let vol = document.getElementsByClassName("volume-slider")[0];


media.removeAttribute("controls");
controls.style.visibility = "visible";

/* add an event listener for clicking the play/pause button and then define it's functionality */

play.addEventListener('click', playPauseMedia);

function playPauseMedia(){

  if(media.paused){
    play.setAttribute('data-icon', 'u');
    media.play();
  } else {
    play.setAttribute('data-icon', 'P');
    media.pause();
  }
}


/* add an event listener for the elapsed time and then define it's functionality */

media.addEventListener("timeupdate", setTime);

function setTime(){

  let minutes = Math.floor(media.currentTime / 60);
  let seconds = Math.floor(media.currentTime - minutes * 60);

  let minuteValue = minutes.toString().padStart(2, "0");
  let secondValue = seconds.toString().padStart(2, "0");

  let mediaTime = `${minuteValue}:${secondValue}`;
  
  /* don't set the bar if we are currently doing something */

  if(isScrubbing)return;

  timer.textContent = mediaTime;
  scrubber.value = (media.currentTime/media.duration) * 100;

}

/*  
  this is just to know if we have finihsed scrubbing or not, 
  I am slightly worried about compatability between browsers and versions, as my research showed that browsers handled these commands differnetly
*/

scrubber.addEventListener("input", () => {
  isScrubbing = true;
});

scrubber.addEventListener("change", () => {
  media.currentTime = scrubber.value/100*media.duration;
  
  isScrubbing = false;
});

/* I felt the need to add an image to show that the page was loading, because otherwise it wasnt clear
And because the images are funny, I actually didn't mind waiting as much */

media.onwaiting = function() {
  setLoadingImgs(true);

}; 

media.onplaying = function() {
  setLoadingImgs(false);
}; 

function setLoadingImgs(b) {
  for(let i=0; i < loadingImgs.length; i++){
    if(b){
      loadingImgs[i].style.visibility = "visible";
    }else {
      loadingImgs[i].style.visibility = "hidden";
    }

  }
}

/* Simple volume slider, also do it at start */

media.volume = vol.value;

vol.addEventListener("input", () => {
  media.volume = vol.value;
});

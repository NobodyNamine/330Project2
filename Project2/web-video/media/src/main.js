/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!
import * as canvas from './canvas.js';
import * as audio from './audio.js';
import * as utils from './utils.js';

const drawParams = {
    showGradient : true,
    showBars : true,
    showCircles : true,
    showNoise : false,
    showInvert : false,
    showEmboss : false
};

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/New Adventure Theme.mp3"
});

function init(){
    
	console.log("init called");
	console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
    audio.setupWebaudio(DEFAULTS.sound1);
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
	setupUI(canvasElement);
    canvas.setupCanvas(canvasElement,audio.analyserNode);
    drawVideo();
    loop();
}

function setupUI(canvasElement){
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#fsButton");
 
   
// checkbox event handlers
  const gradientChk = document.querySelector("#gradientCB");
  const barsChk = document.querySelector("#barsCB");
  const circlesChk = document.querySelector("#circlesCB");
  const noiseChk = document.querySelector("#noiseCB");
  const invertChk = document.querySelector("#invertCB");
  const embossChk = document.querySelector("#embossCB");
    
gradientChk.onchange = e =>{
    if (e.target.checked == true){
        drawParams.showGradient = true;
    }
    else{
        drawParams.showGradient = false;
    }
}
    
barsChk.onchange = e =>{
    if (e.target.checked == true){
        drawParams.showBars = true;
    }
    else{
        drawParams.showBars = false;
    }
}

circlesChk.onchange = e =>{
    if (e.target.checked == true){
        drawParams.showCircles = true;
    }
    else{
        drawParams.showCircles = false;
    }
}

noiseChk.onchange = e =>{
    if (e.target.checked == true){
        drawParams.showNoise = true;
    }
    else{
        drawParams.showNoise = false;
    }
}
invertChk.onchange = e =>{
    if (e.target.checked == true){
        drawParams.showInvert = true;
    }
    else{
        drawParams.showInvert = false;
    }
}
embossChk.onchange = e =>{
    if (e.target.checked == true){
        drawParams.showEmboss = true;
    }
    else{
        drawParams.showEmboss = false;
    }
}
    
playButton.onclick = e =>{
    console.log(`audioCtx.state before = ${audio.audioCtx.state}`);
    
    //check if context is in suspended state (autoplay policy)
    if (audio.audioCtx.state == "suspended"){
        audio.audioCtx.resume();
    }
    console.log(`audioCtx.state after =  ${audio.audioCtx.state}`);
    if (e.target.dataset.playing == "no"){
        //if track is currently paused, play it
        audio.playCurrentSound();
        e.target.dataset.playing = "yes";// our Css will set the text to "Pause"
        //if track IS playing, pause it
    }else{
        audio.pauseCurrentSound();
        e.target.dataset.playing = "no";
    }
};
    
    //C - hookup volume slider & label
    let volumeSlider = document.querySelector("#volumeSlider");
    let volumeLabel = document.querySelector("#volumeLabel");
    
    //add .oninput event to slider
    volumeSlider.oninput = e =>{
        //set the gain
        audio.setVolume(e.target.value);
        //update value of label to match value of slider
        volumeLabel.innerHTML = Math.round((e.target.value/2 * 100));
    };
    
    //set value of label to match initial value of slider
    volumeSlider.dispatchEvent(new Event("input"));
    
    //D - hookup track <select>
    let trackSelect = document.querySelector("#trackSelect");
    //add .onchange event to <select>
    trackSelect.onchange = e =>{
        audio.loadSoundFile(e.target.value);
        // pause the current track if it is playing
        if (playButton.dataset.playing = "yes"){
            playButton.dispatchEvent(new MouseEvent("click"));
        }
    };
    
  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("init called");
    utils.goFullscreen(canvasElement);
  };
	
} // end setupUI

function drawVideo(){
    var v = document.getElementById('v');
    var canvas = document.getElementById('c');
    var context = canvas.getContext('2d');
    //pixel effect
    var cw = Math.floor(canvas.clientWidth / 10);
    var ch = Math.floor(canvas.clientHeight / 10);
    canvas.width = cw;
    canvas.height = ch;

    v.addEventListener('play', function(){
        draw(this,context,cw,ch);
    },false);

    },false);

    function draw(v,c,w,h) {
    if(v.paused || v.ended)	return false;
    c.drawImage(v,0,0,w,h);
    setTimeout(draw,20,v,c,w,h);
        
//        var pat = ctx.createPattern(img,"repeat");
//        ctx.fillStyle = pat;
}

function loop(){
/* NOTE: This is temporary testing code that we will delete in Part II */
	requestAnimationFrame(loop);
//	// 1) create a byte array (values of 0-255) to hold the audio data
//	// normally, we do this once when the program starts up, NOT every frame
//	let audioData = new Uint8Array(audio.analyserNode.fftSize/2);
//	
//	// 2) populate the array of audio data *by reference* (i.e. by its address)
//	//audio.analyserNode.getByteFrequencyData(audioData);
//	audio.analyserNode.getByteTimeDomainData(data); // waveform data
//	// 3) log out the array and the average loudness (amplitude) of all of the frequency bins
//		console.log(audioData);
//		
//		console.log("-----Audio Stats-----");
//		let totalLoudness =  audioData.reduce((total,num) => total + num);
//		let averageLoudness =  totalLoudness/(audio.analyserNode.fftSize/2);
//		let minLoudness =  Math.min(...audioData); // ooh - the ES6 spread operator is handy!
//		let maxLoudness =  Math.max(...audioData); // ditto!
//		// Now look at loudness in a specific bin
//		// 22050 kHz divided by 128 bins = 172.23 kHz per bin
//		// the 12th element in array represents loudness at 2.067 kHz
//		let loudnessAt2K = audioData[11]; 
//		console.log(`averageLoudness = ${averageLoudness}`);
//		console.log(`minLoudness = ${minLoudness}`);
//		console.log(`maxLoudness = ${maxLoudness}`);
//		console.log(`loudnessAt2K = ${loudnessAt2K}`);
//		console.log("---------------------");
    
canvas.draw(drawParams);
}


export {init};
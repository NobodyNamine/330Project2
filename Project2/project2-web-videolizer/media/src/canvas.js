/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/
import * as audio from './audio.js';
import * as utils from './utils.js';
import * as main from './main.js';

let ctx, canvasWidth, canvasHeight, gradient, analyserNode, audioData;
let v = document.getElementById('v');
let canvas = document.getElementById('c');
let context = canvas.getContext('2d');
let cw = Math.floor(screen.width);
let ch = Math.floor(screen.height);


function setupCanvas(canvasElement, analyserNodeRef) {
    // create drawing context
    ctx = canvasElement.getContext("2d");
    canvasWidth = screen.width;
    canvasHeight = screen.height;
    canvas.width = screen.width
    canvas.height = screen.height;
    // create a gradient that runs top to bottom
    gradient = utils.getLinearGradient(ctx, 0, 0, 0, canvasHeight, [{
        percent: 0.25,
        color: "aqua"
    }, {
        percent: 0.75,
        color: "blue"
    }]);
    // keep a reference to the analyser node
    analyserNode = analyserNodeRef;
    // this is the array where the analyser data will be stored
    audioData = new Uint8Array(analyserNode.fftSize / 2);
}

function draw(params = {}) {
    // 1 - populate the audioData array with the frequency data from the analyserNode
    // notice these arrays are passed "by reference" 
    if (document.getElementsByName("choice")[0].checked == true) {
        analyserNode.getByteTimeDomainData(audioData); // waveform data

    } else {
        analyserNode.getByteFrequencyData(audioData);
    }
    // OR


    // 2 - draw background


    // 3 - draw gradient


    if (params.showVideo) {
        //update Slider
        
        //set value of label to match initial value of slider
        if (main.vidNum == 0) {
            v = document.getElementById('v');
        }
        if (main.vidNum == 1) {
            v = document.getElementById('v2');
        }
        if (main.vidNum == 2) {
            v = document.getElementById('v3');
        }
        ctx.save();
        ctx.fillStyle = "white";
        ctx.globalAlpha = 1;
        ctx.drawImage(v, 0, 0, cw, ch);//DRAWING TO CANVAS
        ctx.restore();
        
        //setTimeout(draw, 10, v, ctx, canvasWidth, canvasHeight);
    } else {
        ctx.save();
        ctx.fillStyle = "white";
        ctx.globalAlpha = .1;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.restore();
    }
    
    
    
    if (params.showGradient) {

        gradient = utils.getLinearGradient(ctx, 0, 0, 0, canvasHeight, [{
            percent: 0.25,
            color: "aqua"
                }, {
            percent: 0.75,
            color: "blue"
            }]);


        ctx.save();
        ctx.fillStyle = gradient;
        ctx.globalAlpha = .3;
        ctx.fillRect(0, 0, canvasWidth * 2, canvasHeight * 2);
        ctx.restore();
    }

    // 4 - draw bars
    if (params.showBars) {
        let bassNum = document.querySelector("#BassSlider").value;
        let trebleNum = document.querySelector("#TrebleSlider").value;

        if (params.showBass) {
            audio.lowShelfBiquadFilter.gain.setValueAtTime(bassNum, audio.audioCtx.currentTime);
        } else {
            audio.lowShelfBiquadFilter.gain.setValueAtTime(0, audio.audioCtx.currentTime);

        }
        if (params.showTreble) {
            audio.highShelfBiquadFilter.gain.setValueAtTime(trebleNum, audio.audioCtx.currentTime);
        } else {
            audio.highShelfBiquadFilter.gain.setValueAtTime(0, audio.audioCtx.currentTime);

        }
        ctx.globalAlpha = .1;
        let barSpacing = 1;
        let margin = 0;
        let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin * 2;
        let barWidth = 3 * screenWidthForBars / audioData.length;
        let barHeight = 400;
        let topSpacing = 400;

        ctx.save();
        ctx.fillStyle = 'rgba(255,255,255,0.50)';
        ctx.stokeStyle = 'rgba(0,0,0,0.50)';
        //loop through the data and draw!
        for (let i = 0; i < audioData.length; i++) {
            ctx.fillRect(margin + i * (barWidth + barSpacing), topSpacing + 256 - audioData[i], barWidth, barHeight);
            ctx.strokeRect(margin + i * (barWidth + barSpacing), topSpacing + 256 - audioData[i], barWidth, barHeight);
        }
        ctx.restore();
    }

    if (params.showWaves) {
        ctx.save();
        let start = {
            x: 0,
            y: 0
        };
        let cp1 = {
            x: 70,
            y: screen.height / 3
        };
        let cp2 = {
            x: 30,
            y: screen.height * 2 / 3
        };
        let end = {
            x: 0,
            y: screen.height
        };
        for (let i = 0; i < audioData.length; i++) {
            if (i % 2 == 0) {
                ctx.beginPath();
                ctx.moveTo(start.x, start.y);
                ctx.bezierCurveTo(cp1.x * audioData[i] / 50, cp1.y, cp2.x * audioData[i] / 50, cp2.y, end.x, end.y);
                ctx.strokeStyle = "black";
                ctx.lineWidth = 5;
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(start.x, start.y);
                ctx.bezierCurveTo(cp1.x * audioData[i] / 50, cp1.y, cp2.x * audioData[i] / 50, cp2.y, end.x, end.y);
                ctx.strokeStyle = "white";
                ctx.lineWidth = 5;
                ctx.stroke();
            }
            if (i % 2 == 0) {
                ctx.beginPath();
                ctx.moveTo(screen.width, 0);
                ctx.bezierCurveTo(screen.width - 70 * audioData[i] / 50, cp1.y, screen.width - 30 * audioData[i] / 50, cp2.y, screen.width, end.y);
                ctx.strokeStyle = "black";
                ctx.lineWidth = 5;
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(screen.width, 0);
                ctx.bezierCurveTo(screen.width - 70 * audioData[i] / 50, cp1.y, screen.width - 30 * audioData[i] / 50, cp2.y, screen.width, end.y);
                ctx.strokeStyle = "white";
                ctx.lineWidth = 5;
                ctx.stroke();
            }



        }


        ctx.restore();
    }

    // 5 - draw circles
    if (params.showCircles) {
        let maxRadius = canvasHeight / 4;
        ctx.save();
        ctx.globalAlpha = 0.5;
        for (let i = 0; i < audioData.length; i++) {
            //red-ish circles
            let percent = audioData[i] / 255;

            let circleRadius = percent * maxRadius;
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(255, 0, 81, .34 - percent / 3.0);
            ctx.arc(0, canvasHeight, circleRadius, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            //blue-ish circles, bigger more transparent        
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(0, 0, 0, .10 - percent / 10.0);
            ctx.arc(0, canvasHeight, circleRadius * 1.5, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            //yellow-ish circles, smaller
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(53, 74, 77, .5 - percent / 5.0);
            ctx.arc(0, canvasHeight, circleRadius * .50, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();
            ctx.restore();


            //second set of circles

            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(255, 0, 81, .34 - percent / 3.0);
            ctx.arc(canvasWidth, canvasHeight, circleRadius, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            //blue-ish circles, bigger more transparent        
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(0, 0, 0, .10 - percent / 10.0);
            ctx.arc(canvasWidth, canvasHeight, circleRadius * 1.5, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            //yellow-ish circles, smaller
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(53, 74, 77, .5 - percent / 5.0);
            ctx.arc(canvasWidth, canvasHeight, circleRadius * .50, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        }
        ctx.restore();
    }

    ctx.save();
    ctx.font = '48px Aldrich';
    let tempgradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.globalAlpha = 1;
    let currentTime = audio.element.currentTime;
    let duration = audio.element.duration;
    currentTime = time(currentTime);
    duration = time(duration);

    function time(timeVal) {
        let min = Math.floor(timeVal / 60);
        let sec = timeVal % 60;
        if (min < 10) {
            min = "0" + min;
        }
        if (sec < 10) {
            sec = "0" + sec;
        }
        return min + ':' + String(sec).substring(0, 2);
    }

    ctx.fillText((currentTime), canvas.width / 2 - 95, 50);
    ctx.restore();

    // 6 - bitmap manipulation
    // TODO: right now. we are looping though every pixel of the canvas (320,000 of them!), 
    // regardless of whether or not we are applying a pixel effect
    // At some point, refactor this code so that we are looping though the image data only if
    // it is necessary

    // A) grab all of the pixels on the canvas and put them in the `data` array
    // `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
    // the variable `data` below is a reference to that array 
    let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width;

    if (params.showEmboss) {
        //note we are stepping through *each* sub-pixel
        //DUPLICITY
        for (let i = 0; i < length; i++) {
            if (i % 4 == 3) continue; //skip alpha channel

            data[i] = 127 + 2 * data[i] - data[i + 4] - data[i + width * 2]; //changes this number to 2
        }
    }
    // B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
    for (let i = 0; i < length; i += 4) {
        // C) randomly change every 20th pixel to red
        if (params.showNoise && Math.random() < .05) {
            // data[i] is the red channel
            // data[i+1] is the green channel
            // data[i+2] is the blue channel
            // data[i+3] is the alpha channel
            data[i] = data[i + 1] = data[i + 2] = 0; // zero out the red and green and blue channels
            data[i] = 66; // make the red channel 100% red
            data[i + 1] = 231;
            data[i + 2] = 237;
        } // end if

        if (params.showInvert) {
            let red = data[i],
                green = data[i + 1],
                blue = data[i + 2];
            data[i] = 255 - red;
            data[i + 1] = 255 - green;
            data[i + 2] = 255 - blue;
            //data[i + 3] is the alpha but we're leaving that alone
        }


    } // end for


    // D) copy image data back to canvas
    ctx.putImageData(imageData, 0, 0);
}
export {
    setupCanvas,
    draw,
    v
};

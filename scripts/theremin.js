let canvasDimensions;
let fontRegular;
let osc, playing, freq, amp, reverb;
let A4, minKey, maxKey;
let freqs = [];
let notes = ["A3", "Bb3", "B3", "C4", "C#4", "D4", "Eb4", "E4", "F4", "F#4", "G4", "G#4", "A4", "Bb4", "B4", "C5", "C#5", "D5", "Eb5", "E5", "F5", "F#5", "G5", "G#5", "A5"];

function preload() {
	fontRegular = loadFont("../styles/OpenSans-Regular.ttf");
}

function setup() {
	windowResized();
	var cnv = createCanvas(canvasDimensions[0], canvasDimensions[1]);
	cnv.parent("canvasContainer");
	
	cnv.mousePressed(playOscillator);
	osc = new p5.Oscillator('sine');

	textFont(fontRegular);
	textSize(20);
	fill(255);
	
	frameRate(60);
	frequencyUpdate();
}

//resize canvas to new dimensions of the div whenever the window is resized
function windowResized() {
	var canvasDiv = document.getElementById("canvasContainer");
	canvasDimensions = [canvasDiv.offsetWidth, canvasDiv.offsetHeight];
	resizeCanvas(canvasDimensions[0], canvasDimensions[1], true);
}

//rounds frequency to the nearest semitone
function autoTune(freq) {
	for(let i = 0; i < freqs.length-1; i++) {	//find the two semitones around the frequency
		if(freq > freqs[i] && freq < freqs[i+1]) {
			if((freqs[i+1] - freq) > (freq - freqs[i])) {	//determine which semitone is closest to frequency
				return freqs[i];
			}
			else return freqs[i+1];
			//return ( (freqs[i+1] - freq) > (freq - freqs[i]) ? freqs[i] : freqs[i+1] );
		}
	}
	return freq;
}

function draw() {
	background(0);
	
	//draw lines at each note
	stroke(255);
	for (let i = minKey; i <= maxKey; i++) {
		let x = map(i, minKey, maxKey, 0, width);
		line(x, 0, x, height);
	}

	let key = map(mouseX, 0, canvasDimensions[0], minKey, maxKey);	//map the mouse x coord to a semitone
	freq = constrain(Math.pow(2, key/12)*A4, freqs[0], freqs[freqs.length-1]);	//convert semitone to frequency
	
	if(document.getElementById("autotune").checked) {
		freq = autoTune(freq);
	}
	
	amp = constrain(map(mouseY, canvasDimensions[1], 0, 0, 1), 0, 1);	//map mouse y coord to a loudness
    
    stroke(0);
    text('frequency: ' + freq.toFixed(2), 20, 20);
    text('note: ' + notes[freqs.indexOf(autoTune(freq))], 20, 40);
    text('amplitude: ' + amp.toFixed(2), 20, 60);
    
    if (playing) {
	    // smooth the transitions by 0.1 seconds
	    osc.freq(freq, 0.1);
	    osc.amp(amp, 0.1);
	}
}

function playOscillator() {
	// starting an oscillator on a user gesture will enable audio
	// in browsers that have a strict autoplay policy.
	// See also: userStartAudio();
	osc.start();
	playing = true;
}

function mouseReleased() {
	// ramp amplitude to 0 over 0.5 seconds
	osc.amp(0, 0.5);
	playing = false;
}

function changeWave() {
	osc.setType(document.getElementById("waveSelect").value);
}

// called whenever an option that changes the frequency values is updated
function frequencyUpdate() {
	A4 = document.getElementById("A4Box").value;
	minKey = 0 - document.getElementById("minTone").value;
	maxKey = document.getElementById("maxTone").value;
	freqs = [];
	for(let i = minKey; i <= maxKey; i++) {
		freqs.push(Math.pow(2, i/12)*A4);
	}
}
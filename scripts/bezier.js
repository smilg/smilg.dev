
var canvasDimensions;
var halfDims;
var smallerDimension;

var degreeSkipNoiseScale = 0.005;
var degreeSkipScale = 4;
var noiseScale = .03;
var frameNoiseScale = .02;
var degreeSkip;

var circ;

function setup() {
	seed = random(0,100);
	noiseSeed(seed);
	document.getElementById("seed").innerHTML = seed;
	canvasSetup();
	var canvas = createCanvas(canvasDimensions[0], canvasDimensions[1]);
	canvas.parent("canvasContainer");
	frameRate(60);
	stroke(255);
	degreeSkip = degreeSkipScale * noise(0);
	circ = new Circ(degreeSkip, radiusScale, noiseScale, frameNoiseScale);
	
	//noLoop();
}

function canvasSetup() {
	var canvasDiv = document.getElementById("canvasContainer");
	canvasDimensions = [canvasDiv.offsetWidth, canvasDiv.offsetHeight];
	halfDims = [Math.floor(canvasDimensions[0]/2), Math.floor(canvasDimensions[1]/2)];
	smallerDimension = (canvasDimensions[0] > canvasDimensions[1]) ? 1 : 0;	// gives the index of either the width or height, depending on which is smaller
	radiusScale = halfDims[smallerDimension];
}

function draw() {
	background(0);
    let vertices = [[circ.getX() + halfDims[0], circ.getY() + halfDims[1]]];
    circ.step();
    for(let i = 1; i < circ.getMaxSteps(); i++) {
        vertices.push([circ.getX() + halfDims[0], circ.getY() + halfDims[1]]);
        circ.step();
	}
    
    beginShape();
    vertex(vertices[0][0], vertices[0][1]);
    for(let i = 1; i < vertices.length - 3; i+= 3) {
        bezierVertex(vertices[i][0], vertices[i][1], vertices[i+1][0], vertices[i+1][1], vertices[i+2][0], vertices[i+2][1]);
	}
    endShape();
	circ.stepFrame( /* newDegreeSkip = (degreeSkipScale * noise(circ.getFrame() * degreeSkipNoiseScale)) */ );
}

function windowResized() {
	canvasSetup();
	circ.radiusScale = radiusScale;
	resizeCanvas(canvasDimensions[0], canvasDimensions[1], true);
}

class Circ {
	constructor(degreeSkip, radiusScale, noiseScale, frameNoiseScale) {
		this.angle = 0;
		this.steps = 0;
		this._frame = 0;
	
		this.degreeSkip = degreeSkip;
		this.radiusScale = radiusScale;
		this.noiseScale = noiseScale;
		this.frameNoiseScale = frameNoiseScale;
		
		this.maxSteps = Math.floor(360 / this.degreeSkip);
	}

	step() {
		this.angle += this.degreeSkip;
		this.steps++;
	}
	
	stepFrame(newDegreeSkip = undefined) {
		this.angle = 0;
		this.steps = 0;
		this._frame += 1;
		if(newDegreeSkip) {
			this.degreeSkip = newDegreeSkip;
			this.maxSteps = floor(360/this.degreeSkip);
		}
	}
	
	getAngle() {
		return this.angle;
	}
	
	getSteps() {
		return this.steps;
	}
	
	getFrame() {
		return this._frame;
	}
	
	getMaxSteps() {
		return this.maxSteps;
	}
	
	getX() {
		let radius = this.radiusScale * noise(this.steps * this.noiseScale, this._frame * this.frameNoiseScale);
		return radius * cos(radians(this.angle));
	}
	
	getY() {
		let radius = this.radiusScale * noise(this.steps * this.noiseScale, this._frame * this.frameNoiseScale);
		return radius * sin(radians(this.angle));
	}
	
	getCoords() {
		return [this.getX(), this.getY()];
	}
}

function polarToRect(radius, angle) {
	return [radius * cos(angle), radius * sin(angle)];
}
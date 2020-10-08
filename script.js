var allowedKeys = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
  65: 'a',
  66: 'b'
};

var konamiCode = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'];

var konamiCodePosition = 0;

document.addEventListener('keydown', function(e) {
	// get the value of the key code from the key map
	var key = allowedKeys[e.keyCode];
	// get the value of the required key from the konami code
	var requiredKey = konamiCode[konamiCodePosition];
	if (key == requiredKey) {
		// move to the next key in the konami code sequence
		konamiCodePosition++;
		// if the last key is reached, funny monkey
		if (konamiCodePosition == konamiCode.length) {
			froggyFloat();
			konamiCodePosition = 0;
			}
	} else {
		konamiCodePosition = 0;
	}
});
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function froggyFloat() {
	var frog = document.getElementById('frog');
	var currentStyle = document.getElementById("pagestyle").getAttribute("href");
	if(currentStyle == "style.css") {
		frog.src = "frog.webp";
	}
	frog.style.display = "block";
	frog.className = "frog";
	await sleep(3000);
	frog.className = "";
	frog.style.display = "none";
 }
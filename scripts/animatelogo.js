var paths = [document.querySelector('.box'), document.querySelector('.vert'), document.querySelector('.top'), document.querySelector('.s')];

for (var i = 0; i < paths.length; i++) {
	var path = paths[i]
	var length = path.getTotalLength();
	// Clear any previous transition
	path.style.transition = path.style.WebkitTransition = 'none';
	// Set up the starting positions
	path.style.strokeDasharray = length + ' ' + length;
	path.style.strokeDashoffset = length;
	// Trigger a layout so styles are calculated & the browser
	// picks up the starting position before animating
	path.getBoundingClientRect();
	// Define our transition
	path.style.transition = path.style.WebkitTransition =
	  'stroke-dashoffset 2s ease-in-out';
	// Go!
	path.style.strokeDashoffset = '0';
}


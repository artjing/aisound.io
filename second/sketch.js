/*
Bit patterns

Controls:
  - Move the mouse around.

Author:
  Jason Labbe

Site:
  jasonlabbe3d.com
*/

var speed = 0.1;
var maxSize = 20;
var falloff = 70;
var steps = 13;
var color1;
var color2;

var moveX = 100;
var moveY = 100;
var moveSpeedX = 0.006;
var moveSpeedY = 0.006;

function setup() {
	createCanvas(windowWidth, windowHeight);
	
	textAlign(CENTER);
	noStroke();
	
	color1 = color(255);
	color2 = color(200, 255, 200);
}


function draw() {
	background(0);
	
	for (let x = 100; x < windowWidth-100; x+=steps) {
		for (let y = 100; y < height-200; y+=steps) {
			let mult = 0.2;
			
			// Decrease size the further it's from the mouse.
            moveX = moveX + moveSpeedX;
            moveY = moveY + moveSpeedY;

            if(moveX > width-200){
               moveX = 100;
            }
            if(moveY > height-200){
              moveSpeedY = -moveSpeedY;
            }else if (moveY < 100){
              moveSpeedY = -moveSpeedY;
            } 
          
			let d = dist(moveX, moveY, x, y);
			if (d < falloff) {
				mult = map(d, 0, falloff, 1.0, 0.1);
			}
			
			// Calculate the size.
			let sw = sin((x*y+frameCount)*speed)*maxSize*mult;
			let absSw = abs(sw);
			
			let t;
			
			// Get values based on its size.
			if (sw > 0) {
				fill(color1);
				t = "0";
			} else {
				fill(color2);
				t = "1";
			}
			
			if (absSw > 2) {
				// Display text.
				textSize(absSw);
				text(t, x, y);
			} else {
				// If it's small enough, draw a circle as an optimization.
				ellipse(x, y, absSw, absSw);
			}
		}
	}
}
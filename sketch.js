let sentiment;
let sentimentResult;

var textToWrite = "Input here:";
var typingSize = 34;
const SEGMENTS    = 200;
let centerX, centerY, fontSize, INNER_RADIUS, RADIUS_VARIATION;
var userInputText = "";
var tileSize = 450;
var tileSpeed = 1;
var circleColor = 53
var circleRadius = 250;
var img;
var colors = [];

function preload() {
  loadImage('laser.jpg', setImage);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noCursor();
  noStroke();
  
  centerX = windowWidth/2;
  centerY = windowHeight/2+65;

  let screenPct = min(height, width) / 1000;
  fontSize = screenPct * 150;
  INNER_RADIUS = screenPct * circleRadius;
  RADIUS_VARIATION = screenPct * circleRadius;
  
  textFont('Helvetica');
  textSize(fontSize);
}

function draw() {
  
  background(255);
  fill(0);
  noStroke();
  
  var tileCount = floor(width / max(60*(tileSize/600), 10));
  var rectSize = width / tileCount;
  if(tileSize == 1250){
      tileSpeed = -tileSpeed;
  }
  if(tileSize == 400){
      tileSpeed = -tileSpeed;
  }
  tileSize = tileSize + tileSpeed;
  
  img.loadPixels();
  colors = [];
  
  for (var gridY = 0; gridY < tileCount; gridY++) {
    for (var gridX = 0; gridX < tileCount; gridX++) {
      var px = int(gridX * rectSize);
      var py = int(gridY * rectSize);
      var i = (py * img.width + px) * 4;
      var c = color(img.pixels[i], img.pixels[i + 1], img.pixels[i + 2], img.pixels[i + 3]);
      colors.push(c);
    }
  }
  // console.log(colors[0]._array)
  colors_sorted_on_red = colors.slice().sort(function(a, b){
  if (a._array[0]>b._array[0]){ return -1;}
  else if (a._array[0]<b._array[0]){ return 1;}
  else {
  return 0;
  }
  });
  
  //console.log(colors_sorted_on_red[0]._array)
  var i = 0;
  for (var gridY = 0; gridY < tileCount; gridY++) {
    for (var gridX = 0; gridX < tileCount; gridX++) {
      if (mouseIsPressed){
      fill(colors_sorted_on_red[i]);}
      else{
        fill(colors[i]);}
      rect(gridX * rectSize, gridY * rectSize, rectSize, rectSize);
      i++;
    }
  }
  
  fill(0);
  rect(100,45,600,90);
  
  let title = "Music for the Memory";
  fill(255);
  textSize(62);
  text(title, 50, 60, 700, 100);
  
  let s = "Please recall your first memory and try to summarize it in one sentence. Please enter it directly, and press Enter.->->->->->";
  fill(255,255,255,230);
  textSize(18);
  text(s, 52,133, 200, 300);

    //draw sphere
  beginShape();
    fill(255,255,255,circleColor);
    for (let i = 0; i < SEGMENTS; i++) {
      let p0 = pointForIndex(i/SEGMENTS);
      vertex(p0.x, p0.y);
    }
  endShape(CLOSE);
  
  //draw text
  let pct = atan2(200 - centerY, 0 - centerX) / TWO_PI;//follow mouse
  //let pct = 0;//dont follow mouse
  let pixToAngularPct = 2/((INNER_RADIUS+RADIUS_VARIATION/2)*TWO_PI);
  for (var i = 0; i < textToWrite.length; i++) {
    let charWidth = textWidth(textToWrite.charAt(i));
    pct += charWidth/2 * pixToAngularPct;
    
    //calculate angle
    let leftP = pointForIndex(pct-0.01);
    let rightP = pointForIndex(pct+0.01);
    let angle = atan2(leftP.y - rightP.y, leftP.x - rightP.x) + PI;
    
    push();
      let p = pointForIndex(pct);
      //apply angle
      translate(p.x, p.y);
      rotate(angle);
      translate(-p.x, -p.y);
        fill(255,255,255);
            textSize(typingSize);
      text(textToWrite.charAt(i), p.x-charWidth/2, p.y);
    pop();
    
    pct += charWidth/2 * pixToAngularPct;
  }//for
}

function setImage(loadedImageFile) {
  img = loadedImageFile;
}

function pointForIndex(pct) {
  const NOISE_SCALE       = 1.5;
  let angle = pct * TWO_PI;
  let cosAngle = cos(angle);
  let sinAngle = sin(angle);
  let time = frameCount / 100;
  let noiseValue = noise(NOISE_SCALE * cosAngle + NOISE_SCALE, NOISE_SCALE * sinAngle + NOISE_SCALE, time);
  let radius = INNER_RADIUS + RADIUS_VARIATION * noiseValue;
  return {
    x: radius * cosAngle + centerX,
    y: radius * sinAngle + centerY
  };
}

function keyPressed() {
  if(textToWrite === 'Input here:'){
    typingSize = 30;
    textToWrite='';
  }
  
  if(key === 'Backspace'){
    textToWrite = textToWrite.substring(0,textToWrite.length-1);
    return;
  }else if(key === 'Shift'||key === 'CapsLock'|| key ==='ArrowLeft' || key ==='ArrowRight' || key ==='ArrowTop' || key ==='ArrowDown')
  {
    return;
  }else if(key === 'Enter')
  {
    document.getElementById("loader").style.display = "block";
    sentiment = ml5.sentiment('movieReviews', modelReady);
    return;
  }else{
      textToWrite+=key;
  }
}

function modelReady() {
  // model is ready
  //statusEl.html('model loaded');
    const text = textToWrite.substring(0,textToWrite.length);
    console.log(textToWrite.substring(0,textToWrite.length));

    const prediction = sentiment.predict(text);
    console.log(prediction.score);
    var newurl= "second/musicplay.html?predict="+ prediction.score;
    window.location.href= newurl;
}

// We need a variable to hold our image
let img;

// We will divide the image into segments
let numSegments = 50;

// We will store the segments in an array
let segments = [];

// Let's add a variable to switch between drawing the image and the segments
let drawSegments = true;

// Let's make an object to hold the draw properties of the image
let imgDrwPrps = { aspect: 0, width: 0, height: 0, xOffset: 0, yOffset: 0 };

// And a variable for the canvas aspect ratio
let canvasAspectRatio = 0;

// Let's load the image from disk
function preload() {
  img = loadImage("assets/Mona_Lisa_by_Leonardo_da_Vinci_500_x_700.jpg");
}

function setup() {
  // We will make the canvas the same size as the window
  createCanvas(windowWidth, windowHeight);
  // Let's calculate the aspect ratio of the image - this will never change so we only need to do it once
  imgDrwPrps.aspect = img.width / img.height;

  // We can use the width and height of the image to calculate the size of each segment
  let segmentWidth = img.width / numSegments;
  let segmentHeight = img.height / numSegments;

  for (let segYPos = 0; segYPos < img.height; segYPos += segmentHeight) {
    // This is looping over the height
    for (let segXPos = 0; segXPos < img.width; segXPos += segmentWidth) {
      // We will use the x and y position to get the colour of the pixel from the image
      // Let's take it from the centre of the segment
      let segmentColour = img.get(segXPos + segmentWidth / 2, segYPos + segmentHeight / 2);
      let segment = new ImageSegment(segXPos, segYPos, segmentWidth, segmentHeight, segmentColour);
      segments.push(segment);
    }
  }

  // Calculate initial draw properties of the image
  calculateImageDrawProps();
}

function draw() {
  background(0);
  if (drawSegments) {
    // Let's draw the segments to the canvas
    for (const segment of segments) {
      segment.draw();
      segment.update();
    }
  } else {
    // Let's draw the image to the canvas
    image(img, imgDrwPrps.xOffset, imgDrwPrps.yOffset, imgDrwPrps.width, imgDrwPrps.height);
  }
}

function keyPressed() {
  if (key == " ") {
    // This is a neat trick to invert a boolean variable,
    // it will always make it the opposite of what it was
    drawSegments = !drawSegments;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateImageDrawProps();
}

function calculateImageDrawProps() {
  // Calculate the aspect ratio of the canvas
  canvasAspectRatio = width / height;

  // If the image is wider than the canvas
  if (imgDrwPrps.aspect > canvasAspectRatio) {
    // Then we will draw the image to the width of the canvas
    imgDrwPrps.width = width;
    // And calculate the height based on the aspect ratio
    imgDrwPrps.height = width / imgDrwPrps.aspect;
    imgDrwPrps.yOffset = (height - imgDrwPrps.height) / 2;
    imgDrwPrps.xOffset = 0;
  } else {
    // Otherwise we will draw the image to the height of the canvas
    imgDrwPrps.height = height;
    // And calculate the width based on the aspect ratio
    imgDrwPrps.width = height * imgDrwPrps.aspect;
    imgDrwPrps.xOffset = (width - imgDrwPrps.width) / 2;
    imgDrwPrps.yOffset = 0;
  }
}


// Here is our class for the image segments, we start with the class keyword
class ImageSegment {

  constructor(srcImgSegXPosInPrm, srcImgSegYPosInPrm, srcImgSegWidthInPrm, srcImgSegHeightInPrm, srcImgSegColourInPrm) {
    // These parameters are used to set the internal properties of an instance of the segment
    // These parameters are named as imageSource as they are derived from the image
    this.srcImgSegXPos = srcImgSegXPosInPrm;
    this.srcImgSegYPos = srcImgSegYPosInPrm;
    this.srcImgSegWidth = srcImgSegWidthInPrm;
    this.srcImgSegHeight = srcImgSegHeightInPrm;
    this.srcImgSegColour = srcImgSegColourInPrm;
    this.scale = 1;
  }

  draw() {
    // Let's draw the segment to the canvas
    stroke(0);
    fill(this.srcImgSegColour);
    rect(this.srcImgSegXPos, this.srcImgSegYPos, this.srcImgSegWidth * this.scale, this.srcImgSegHeight * this.scale);
  }

  update() {
    // Update the scale of the segment based on the mouse position
    this.scale = map(dist(this.srcImgSegXPos, this.srcImgSegYPos, mouseX, mouseY), width, 0, 0, 1);
    if (this.scale > 1) {
      this.scale = 1;
    }
    if (this.scale < 0) {
      this.scale = 0;
    }
  }
}

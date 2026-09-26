// IAT 806 — W2: variables, draw loop, conditionals, random
// Controls:
// - Hold and release the left mouse button to launch the ball away from the mouse.
// - Spacebar pauses/unpauses the game.
// - Enter moves the ball to a random location that is not touching the pit.
console.log("IAT 806 — W2: variables, draw loop, conditionals, random");
let ballX = 80;
let ballY = 66;
let ballsize = 20;
let pitX = 50;
let pitY = 50;
let pitSize = 20;
let targetImage = null;
let campusImage = null;
let targetX = 20;
let targetY = 20;
let targetSize = 40;
let speedX = 1;
let speedY = 1;
let ballVelocityX = 0;
let ballVelocityY = 0;
let paused = false;
let collision = false;
let level = 1;
let hit = false;

function setup() {
  createCanvas(800, 800);
  loadImage("proffhead.jpg", (loadedImage) => {
    targetImage = loadedImage;
  });
  loadImage("surreycampus.jpg", (loadedImage) => {
    campusImage = loadedImage;
  });
  let rPit = pitSize / 2;

  pitX = random(rPit, width - rPit);
  pitY = random(rPit, height - rPit);
}

function draw() {
  if (campusImage) {
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = campusImage.width;
    let sourceHeight = campusImage.height;
    let canvasRatio = width / height;

    if (sourceWidth / sourceHeight > canvasRatio) {
      sourceWidth = sourceHeight * canvasRatio;
      sourceX = (campusImage.width - sourceWidth) / 2;
    } else {
      sourceHeight = sourceWidth / canvasRatio;
      sourceY = (campusImage.height - sourceHeight) / 2;
    }

    image(
      campusImage,
      0,
      0,
      width,
      height,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
    );
  } else {
    background(1);
  }

  let rBall = ballsize / 2;
  let rPit = pitSize / 2;

  pitSize = 20 + level * 30;

  if (!paused) {
    // Move the ball using the velocity created when the mouse is released.
    ballX += ballVelocityX;
    ballY += ballVelocityY;

    // Slow the ball down gradually.
    ballVelocityX *= 0.99;
    ballVelocityY *= 0.99;

    // Bounce the ball from edges.
    if (ballX > width - rBall) {
      ballX = width - rBall;
      ballVelocityX *= -1;
    }

    if (ballX < rBall) {
      ballX = rBall;
      ballVelocityX *= -1;
    }

    if (ballY > height - rBall) {
      ballY = height - rBall;
      ballVelocityY *= -1;
    }

    if (ballY < rBall) {
      ballY = rBall;
      ballVelocityY *= -1;
    }

    // Move the pit.
    pitX += speedX;
    pitY += speedY;

    //wall bouce
    if (pitX > width - rPit || pitX < rPit) {
      speedX *= -1;
    }

    if (pitY > height - rPit || pitY < rPit) {
      speedY *= -1;
    }
  }

  // check the distance between ball and pit.
  let distanceBetween = dist(ballX, ballY, pitX, pitY);

  // If ball and pit overlap, reset the level to 1.
  if (distanceBetween < rBall + rPit) {
    // Only trigger once.
    if (collision === false) {
      level = 1;
      collision = true;
    }
  } else {
    // They have separated, so another collision can be detected later.
    collision = false;
  }

  // Draw the ball.
  noStroke();
  fill(255);
  circle(ballX, ballY, ballsize);

  // Draw the moving pit.
  fill(255, 0, 0);
  circle(pitX, pitY, pitSize);

  //draw pause text
  if (paused) {
    fill(240, 240, 54);
    textSize(60);
    text("PAUSED", width / 2 - 60, height / 2);
  }

  // Find the point on the target square closest to the ball's centre.
  let closestX = constrain(ballX, targetX, targetX + targetSize);
  let closestY = constrain(ballY, targetY, targetY + targetSize);

  // Find the distance from the ball centre to that closest point.
  let distanceToTarget = dist(ballX, ballY, closestX, closestY);

  // ball collides with target
  if (distanceToTarget < rBall) {
    if (hit === false) {
      level++;

      // Move the target
      targetX = random(0, width - targetSize);
      targetY = random(0, height - targetSize);

      hit = true;
    }
  } else {
    hit = false;
  }

  // Draw the target square.
  if (targetImage) {
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = targetImage.width;
    let sourceHeight = targetImage.height;

    if (sourceWidth > sourceHeight) {
      sourceX = (sourceWidth - sourceHeight) / 2;
      sourceWidth = sourceHeight;
    } else {
      sourceY = (sourceHeight - sourceWidth) / 2;
      sourceHeight = sourceWidth;
    }

    image(
      targetImage,
      targetX - targetSize / 2,
      targetY - targetSize / 2,
      targetSize * 2,
      targetSize * 2,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
    );
  } else {
    fill(255, 34, 90);
    rect(targetX, targetY, targetSize, targetSize);
  }

  // Draw the level .
  fill(255);
  textSize(60);
  text("Level: " + level, 500, 50);
}

function mouseReleased() {
  // Do not launch while paused.
  if (paused) {
    return;
  }

  // Find the vector from the mouse back toward the ball.
  // This launches the ball in the opposite direction of the pull.
  let pullX = ballX - mouseX;
  let pullY = ballY - mouseY;

  // Convert pull distance into speed.
  ballVelocityX = pullX * 0.02;
  ballVelocityY = pullY * 0.02;
}

function keyPressed() {
  // Spacebar pauses or unpauses.
  if (key === " ") {
    paused = !paused;
    //write pause on screen

    return false;
  }
}

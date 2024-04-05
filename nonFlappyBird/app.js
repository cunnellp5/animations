const SPACE = 32;

let bird;
let gravity;
let pipe1;
let pipe2;
let playing;
let score;

function setup() {
  createCanvas(700, 700);

  bird = new Bird(createVector(10, 10));

  pipe1 = new Pipe(createVector(width/2, 0));
  pipe2 = new Pipe();

  gravity = createVector(0, 0.5);
  playing = true;
  score = 0;
}

function draw() {
  background(0);

  pipe1.update();
  pipe2.update();

  if (pipe2.isOffScreen()) {
    pipe1 = new Pipe();
    if (playing) score = score + 1;
  }

  if (pipe1.isOffScreen()) {
    pipe2 = new Pipe();
    if (playing) score = score + 1;
  }

  pipe1.display();
  pipe2.display();

  if (playing) {
    if (bird.collidingWith(pipe1)) {
      playing = false;
    }
    bird.applyForce(gravity);
    bird.update();

    if (bird.isOffScreen()) {
      playing = false;
    }
    bird.display();
  }

  fill(255);
  textSize(42);
  text(score, width - 50, 55);
}

function keyPressed() {
  if (keyCode === SPACE) bird.flap()
}

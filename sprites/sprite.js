let playerState = "run";

const canvas = document.getElementById("sprite");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = (canvas.width = 600);
const CANVAS_HEIGHT = (canvas.height = 600);

const spriteWidth = 575;
const spriteHeight = 523;

const playerImage = new Image();
playerImage.src = "../media/shadow_dog.png";

let frameX = 0;
let frameY = 0;
let gameFrame = 0;
let staggerFrames = 5;

const spriteAnimations = [];

const animationStates = [
  {
    id: 0,
    name: "idle",
    frames: 7,
  },
  {
    id: 1,
    name: "jump",
    frames: 7,
  },
  {
    id: 2,
    name: "fall",
    frames: 7,
  },
  {
    id: 3,
    name: "run",
    frames: 9,
  },
  {
    id: 4,
    name: "dizzy",
    frames: 11,
  },
  {
    id: 5,
    name: "sit",
    frames: 5,
  },
  {
    id: 6,
    name: "roll",
    frames: 7,
  },
  {
    id: 7,
    name: "bite",
    frames: 7,
  },
  {
    id: 8,
    name: "ko",
    frames: 12,
  },
  {
    id: 9,
    name: "getHit",
    frames: 4,
  },
];

animationStates.forEach((state, index) => {
  let frames = {
    loc: [],
  };

  for (let i = 0; i < state.frames; i++) {
    let postitionX = i * spriteWidth;
    let positionY = index * spriteHeight;

    frames.loc.push({
      x: postitionX,
      y: positionY,
    });
  }

  spriteAnimations[state.name] = frames;
});

const animate = () => {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  let position =
    Math.floor(gameFrame / staggerFrames) %
    spriteAnimations[playerState].loc.length;

  frameX = spriteWidth * position;
  frameY = spriteAnimations[playerState].loc[position].y;

  // ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
  ctx?.drawImage(
    playerImage,
    frameX,
    frameY,
    spriteWidth,
    spriteHeight,
    0,
    0,
    spriteWidth,
    spriteHeight
  );

  gameFrame++;

  updateDoc({
    element: "stance",
    msg: `Stance: ${playerState}`,
  });

  requestAnimationFrame(animate);
};

const updateDoc = ({ element, msg }) => {
  document.getElementById(element).firstChild.nodeValue = msg;
};

document.addEventListener(
  "keypress",
  (event) => {
    var name = event.key;
    var code = event.code;

    let currentIndex = animationStates.findIndex(
      (state) => state.name === playerState
    );

    if (code === "KeyW") {
      if (currentIndex < animationStates.length - 1) {
        console.log(animationStates[currentIndex++], "up");
        playerState = animationStates[currentIndex++].name;
        updateDoc({
          element: "keyPressed",
          msg: `Key: ${name}`,
        });
      }
    }

    if (code === "KeyS") {
      if (currentIndex > 1) {
        console.log(animationStates[currentIndex--], "down");
        playerState = animationStates[currentIndex++].name;
        updateDoc({
          element: "keyPressed",
          msg: `Key: ${name}`,
        });
      }
    }
  },
  false
);

animate();

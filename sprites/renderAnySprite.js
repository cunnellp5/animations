const canvas = document.getElementById('sprite');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width = 300;
const CANVAS_HEIGHT = canvas.height = 300;

const spriteWidth = 896 / 7;
const spriteHeight = 128 / 1;

const sprite = new Image();
sprite.src = '../media/hotdog.png';

let frameX = 0;
let frameY = 0;
let gameFrame = 0;
let staggerFrames = 10;


const spriteAnimations = []

const animate = () => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.drawImage(sprite, frameX * spriteWidth, 0, spriteWidth, spriteHeight, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    if(gameFrame % staggerFrames === 0) {
        if(frameX < 6) {
            frameX++;
        } else {
            frameX = 0;
        }
    }

    gameFrame++;
    requestAnimationFrame(animate);
}

animate();
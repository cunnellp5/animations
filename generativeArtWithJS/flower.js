import { Root } from './root.js';
// spritesheet = 300px x 300px
// each frame is 100px

export class Plant extends Root {
    update() {
        this.x += this.speedX + Math.sin(this.angleX); // each animation frame will update speedX by x
        this.y += this.speedY + Math.sin(this.angleY); // negative values will move up; positive will move down
        this.size += this.vs; // increases .1 px for each animation frame
        this.angleX += this.vaX;
        this.angleY += this.vaY;

        if (this.lightness < 70) {
            this.lightness += 0.25
        }

        if (this.size < this.maxSize) {
            this.ctx.beginPath(); // starts drawing
            this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2) // draw an circle
            this.ctx.fillStyle = `hsl(140, 100%, ${this.lightness}%)`;
            this.ctx.fill();
            this.ctx.stroke();
            requestAnimationFrame(this.update.bind(this));
        } else {
            const flower = new Flower(this.x, this.y, this.size, this.ctx);
            flower.grow();
        }
    }
}

export class Flower {
    constructor(x, y, size, ctx) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.size = size;
        this.vs = Math.random() * 0.3 + 0.2;
        this.maxFlowerSize = this.size + Math.random() * 100;
        this.image = new Image();
        this.image.src = 'flowers.png'
        this.frameSize = 100; // frame of each flower
        this.frameX = Math.floor(Math.random() * 3);
        this.frameY = Math.floor(Math.random() * 3);
        this.angle = 0;
        this.va = Math.random() * 0.05 - 0.025;

        this.size > 11
            ? this.willFlower = true 
            : this.willFlower = false;
    }

    grow () {
        if (this.size < this.maxFlowerSize && this.willFlower) {
            this.size += this.vs;
            this.angle += this.va;

            this.ctx.save();
            this.ctx.translate(this.x, this.y);
            this.ctx.rotate(this.angle);

            this.ctx.drawImage(
                this.image,
                this.frameSize * this.frameX, // changes position on sprite sheet randomly
                this.frameSize * this.frameY, // changes position on sprite sheet randomly
                this.frameSize,
                this.frameSize,
                0 - this.size / 2,
                0 - this.size / 2,
                this.size,
                this.size
            );

            this.ctx.restore();

            requestAnimationFrame(this.grow.bind(this))
        }

    }
}

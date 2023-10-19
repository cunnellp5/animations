export class Root {
    constructor(x, y, ctx) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.speedX = Math.random() * 4 - 2; // random number between -2 and 2
        this.speedY = Math.random() * 4 - 2; // random number between -2 and 2
        this.maxSize = Math.random() * 7 + 5 // random number between 5 and 12
        this.size = Math.random() * 1 + 2 // random number between 2 and 3
        this.vs = Math.random() * 0.2 + 0.05 // velocity of size; irregular growth speed
        this.angleX = Math.random() * 6.2; // radians, changes angle
        this.vaX = Math.random() * 0.6 - 0.3 // velocity of angle
        this.angleY = Math.random() * 6.2; // radians, changes angle
        this.vaY = Math.random() * 0.6 - 0.3 // velocity of angle
        this.lightness = 10;
    }

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
            requestAnimationFrame(this.update.bind(this));
        } 
    }
}
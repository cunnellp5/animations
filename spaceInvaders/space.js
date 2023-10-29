class Planet {
    constructor(game) {
        this.game = game;
        this.x = this.game.width * 0.5;
        this.y = this.game.height * 0.5;
        this.radius = 80;
        this.image = document.getElementById('planet');
    }

    draw (context) {
        context.drawImage(this.image, this.x - 100, this.y - 100)
        if(this.game.debug) {
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            context.stroke();
        }
    }
}

class Player {
    constructor (game) {
        this.game = game;
        this.x = this.game.width * 0.5;
        this.y = this.game.height * 0.5;
        this.radius = 40;
        this.image = document.getElementById('player');
        this.aim;
        this.angle = 0;
    }

    draw (context) {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle);
        context.drawImage(this.image, -this.radius, -this.radius)
        if(this.game.debug) {
            context.beginPath();
            context.arc(0, 0, this.radius, 0, Math.PI * 2);
            context.stroke();
        }
        context.restore();
    }

    update () {
        this.aim = this.game.calcAim(this.game.planet, this.game.mouse);
        this.x = this.game.planet.x + (this.game.planet.radius + this.radius) * this.aim[0];
        this.y = this.game.planet.y + (this.game.planet.radius + this.radius) * this.aim[1];
        this.angle = Math.atan2(this.aim[3], this.aim[2]);
    }

    shoot () {
        const projectile = this.game.getProjectile();

        if (projectile) {
            projectile.start(
                this.x + this.radius * this.aim[0],
                this.y + this.radius * this.aim[1],
                this.aim[0],
                this.aim[1]
            );
        };
    }
}

class Projectile {
    constructor (game) {
        this.game = game;
        this.x;
        this.y;
        this.radius = 5;
        this.speedX = 1;
        this.speedY = 1;
        this.speedModifier = 5;
        this.free = true;
        this.isPeen = false;
        this.angle = 0;
        this.angleModifier = (45 * Math.PI / 180);

        window.addEventListener('keyup', e => {
            if(e.key === 'p') {
                this.isPeen = !this.isPeen;
            }
        })
    }

    start (x, y, speedX, speedY, angle) {
        this.free = false;
        this.x = x;
        this.y = y;
        this.speedX = speedX * this.speedModifier;
        this.speedY = speedY * this.speedModifier;
        this.angle = angle;
    }


    reset () {
        this.free = true;
    }

    draw (context) {
        if(this.isPeen) {            
            context.save();
            context.translate(this.x, this.y)
            context.rotate((Math.atan2(this.speedY, this.speedX)) + this.angleModifier);
            context.drawImage(
                document.getElementById('penis'),
                -this.radius * 5,
                -this.radius * 5,
            );
            context.restore();

            if (this.game.debug) {
                context.beginPath();
                context.arc(this.x, this.y, this.radius * 5, 0, Math.PI * 2);
                context.stroke();
            }
        }
        else {
            if(!this.free) {
                context.save();
                context.beginPath();
                context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                context.fillStyle = 'gold';
                context.fill();
                context.restore();
            }
        }
    }

    update () {
        if (!this.free) {
            this.x += this.speedX;
            this.y += this.speedY;
        }

        if (this.x < 0 
            || this.x > this.game.width 
            || this.y < 0 
            || this.y > this.game.height) {
            this.reset();
        }
    }
}

class Enemy {
    constructor (game) {
        this.game = game;
        this.x = 100;
        this.y = 100;
        this.radius = 40;
        this.width = this.radius * 2;
        this.height = this.radius * 2;
        this.speedX = 0;
        this.speedY = 0;
        this.speedModifier = Math.random() * 0.5 + 0.1;
        this.angle = 0;
        this.collided = false;
        this.free = true;
    }

    start () {
        this.free = false;
        this.collided = false;
        this.frameX = 0;
        this.lives = this.maxLives;
        // this can lead to issues if other enemy sprite sheets dont have 4 sprite rows
        this.frameY = Math.floor(Math.random() * 4);

        if (Math.random() < 0.5) {
            this.x = Math.random() * this.game.width;
            this.y = Math.random() < 0.5 
                ? -this.radius
                : this.game.height + this.radius;
        } else {
            this.x = Math.random() < 0.5 
                ? -this.radius
                : this.game.width + this.radius;
            this.y = Math.random() * this.game.height;
        }
        // calc aim after position of enemies
        const aim = this.game.calcAim(this, this.game.planet);
        this.speedX = aim[0] * this.speedModifier;
        this.speedY = aim[1] * this.speedModifier;
        this.angle = Math.atan2(aim[3], aim[2]) + Math.PI * 0.5;
    }

    reset () {
        this.free = true;
    }

    hit (damage) {
        this.lives -= damage;
        if (this.lives >= 1) {
            this.frameX++;
        }
    }

    draw (context) {
        if (!this.free) {
            context.save();
            context.translate(this.x, this.y);
            context.rotate(this.angle);
            context.drawImage(
                this.image,
                this.frameX * this.width,
                this.frameY * this.height,
                this.width,
                this.height,
                -this.radius,
                -this.radius,
                this.width,
                this.height
            );
            if (this.game.debug) {
                context.beginPath();
                context.arc(0, 0, this.radius, 0, Math.PI * 2);
                context.stroke();
                context.fillText(this.lives, 0, 0);
            }
            context.restore();
        }
    }

    update () {
        if (!this.free) {
            this.x += this.speedX;
            this.y += this.speedY;

            // check collision enemy/planet
            if (this.game.checkCollision(this, this.game.planet) && this.lives >= 1) {
                this.lives = 0;
                this.speedX = 0;
                this.speedY = 0;
                this.collided = true;
                this.game.lives--;
            }
            
            // check collision enemy/player
            if (this.game.checkCollision(this, this.game.player) && this.lives >= 1) {
                this.lives = 0;
                this.collided = true;
                this.game.lives--;
            }

            // check collision enemy/projectile
            this.game.projectilePool.forEach((projectile) => {
                if (!projectile.free) {
                    if (this.game.checkCollision(this, projectile) && this.lives >= 1) {
                        projectile.reset();
                        this.hit(1)
                    }
                }
            })

            // sprite animation
            if (this.lives < 1 && this.game.spriteUpdate) {
                this.frameX++;
            }

            if (this.frameX > this.maxFrame) {
                this.reset();
                if (!this.collided && !this.game.gameOver) {
                    this.game.score += this.maxLives;
                }
            }
        }
    }
}

class Asteroid extends Enemy {
    constructor (game) {
        super(game);
        this.image = document.getElementById('asteroid');
        this.frameX = 0;
        this.frameY = Math.floor(Math.random() * 4);
        this.maxFrame = 7;
        this.lives = 1;
        this.maxLives = this.lives;
    }
}

class LobsterMorph extends Enemy {
    constructor (game) {
        super(game);
        this.image = document.getElementById('lobsterMorph');
        this.frameX = 0;
        this.frameY = Math.floor(Math.random() * 4);
        this.maxFrame = 14;
        this.lives = 8;
        this.maxLives = this.lives;
    }
}

class BeetleMorph extends Enemy {
    constructor (game) {
        super(game);
        this.image = document.getElementById('beetleMorph');
        this.frameX = 0;
        this.frameY = Math.floor(Math.random() * 4);
        this.maxFrame = 3;
        this.lives = 1;
        this.maxLives = this.lives;
    }
}

class RhinoMorph extends Enemy {
    constructor (game) {
        super(game);
        this.image = document.getElementById('rhinoMorph');
        this.frameX = 0;
        this.frameY = Math.floor(Math.random() * 4);
        this.maxFrame = 6;
        this.lives = 4;
        this.maxLives = this.lives;
    }
}


class Game {
    constructor (canvas) {
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.planet = new Planet(this);
        this.player = new Player(this);
        this.debug = false;

        // projectile pool
        this.projectilePool = [];
        this.numberOfProjectiles = 20;
        this.createProjectilePool();

        // enemy pool
        this.enemyPool = [];
        this.numberOfEnemies = 20;
        this.createEnemyPool();
        this.enemyPool[0].start();
        this.enemyTimer = 0;
        this.enemyInterval = 1200;

        // sprite sheet
        this.spriteUpdate = false;
        this.spriteTimer = 0;
        this.spriteInterval = 150;

        // game
        this.score = 0;
        this.winningScore = 100;
        this.lives = 10;

        this.mouse = {
            x: 0,
            y: 0,
        }

        // event listeners
        window.addEventListener('mousemove', e => {
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
        })
        window.addEventListener('mousedown', e => {
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
            this.player.shoot();
        })
        window.addEventListener('keyup', e => {
            if(e.key === 'd') {
                this.debug = !this.debug;
            } else if (e.key === '1') {
                this.player.shoot();
            }
        })
    }
    
    render (context, deltaTime) {
        this.planet.draw(context);

        this.drawStatusText(context);

        this.player.draw(context);
        this.player.update();

        this.projectilePool.forEach(projectile => {
            projectile.draw(context);
            projectile.update();
        })

        this.enemyPool.forEach(enemy => {
            enemy.draw(context);
            enemy.update();
        })

        // periodically activate an enemy
        if (!this.gameOver) {
            if (this.enemyTimer < this.enemyInterval) {
                this.enemyTimer += deltaTime;
            } else {
                this.enemyTimer = 0;
                const enemy = this.getEnemy();
                if (enemy) {
                    enemy.start();
                }
            }
        }

        // periodically update sprites
        if (this.spriteTimer < this.spriteInterval) {
            this.spriteTimer += deltaTime;
            this.spriteUpdate = false;
        } else {
            this.spriteTimer = 0;
            this.spriteUpdate = true;
        }

        // win/lose condition
        if (this.score >= this.winningScore || this.lives < 1) {
            this.gameOver = true;
        }
    }

    drawStatusText (context) {
        // this is where to import google fonts 1:38:52
        context.save();
        context.textAlign = 'left'
        context.font = '30px Impact';
        context.fillText('Score: ' + this.score, 10, 30);

        for (let i = 0; i < this.lives; i++) {
            context.fillRect(10 + 15 * i, 50, 10, 15);
            // loadingbar example
            // context.fillRect(20 + 15 * i, 60, 15, 30);
        }

        if (this.gameOver) {
            context.textAlign = 'center';
            let title;
            let subTitle;
            
            if (this.score >= this.winningScore) {
                title = 'You win!';
                subTitle = `Your score is ${this.score}!`
            } else {
                title = 'You lose!'
                subTitle = `Try again, bitch!`
            }

            context.font = '100px Impact';
            context.fillText(title, this.width * 0.5, 300);
            context.font = '50px Impact';
            context.fillText(subTitle, this.width * 0.5, 580);
        }
        context.restore();
    }

    calcAim (a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.hypot(dx, dy);
        const aimX = dx / distance * -1;
        const aimY = dy / distance * -1;

        return [aimX, aimY, dx, dy];
    }

    checkCollision (a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.hypot(dx, dy);
        const sumOfRadii = a.radius + b.radius;
        return distance < sumOfRadii;
    }

    createProjectilePool () {
        for (let i = 0; i < this.numberOfProjectiles; i++) {
            this.projectilePool.push(new Projectile(this));
        }
    }

    getProjectile () {
        for (let i = 0; i < this.projectilePool.length; i++) {
            if (this.projectilePool[i].free) {
                return this.projectilePool[i];
            }
        }
    }

    createEnemyPool () {
        for (let i = 0; i < this.numberOfEnemies; i++) {
            let randomNumber = Math.random();

            // in 25% of cases create asteroid
            if (randomNumber < 0.25) {
                this.enemyPool.push(new Asteroid(this));
            } else if (randomNumber < 0.5) {
                this.enemyPool.push(new BeetleMorph(this));
            } else if (randomNumber < 0.75) {
                this.enemyPool.push(new RhinoMorph(this));
            } else {
                this.enemyPool.push(new LobsterMorph(this));
            }
        }
    }

    getEnemy () {
        for (let i = 0; i < this.enemyPool.length; i++) {
            if (this.enemyPool[i].free) {
                return this.enemyPool[i];
            }
        }
    }
}

window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 900;
    canvas.height = 900;
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';
    ctx.lineWidth = 2;
    ctx.font = '50px Helvetica';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const game = new Game(canvas);

    let lastTime = 0;

    function animate (timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        game.render(ctx, deltaTime);
        requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
})


// Stretch goals:
// - optimize game loops and renders such that some of them dont continuously runInContext
// - add a health bar above enemies
// - refactor classes into separate files
// - give planet lives
// - give player lives
// - add flash animation on collision
// - optimize peen rotation. probably dont need to recalc
// - sprite animate the planet as lives are lost
// - sprite animate the space ship as lives are lost

// update score when enemy dies, not after full animation

// implement enemies from the other space invaders game

// - power up ideas
//     - stronger weapons
//     - modifiers like shields
//     - star powers
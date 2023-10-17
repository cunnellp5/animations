const canvas = document.getElementById("penis");
const ctx = canvas.getContext("2d");


const getRandomNumber = (max, min) => {
  return Math.floor(Math.random() * (max - min) + min);
}

class Dick {
  pubeHairs = null;
  constructor({
    x = 30,
    y = 50,
    height = 20,
    width = 11.6,
    radius = Math.PI * 2.3, // 7.23

    shaftToHeadRatioX = 1.33,
    shaftToHeadRatioY = 0.68,
    shaftToHeadWidthRatio = 8.62,
    shaftToHeadHeightRatio = 1.65,
    shaftToRadiusRatio = 1.384,

    pensiLineToHeadStart = 0.33,
    pensiLineToHeadEnd = 0.66,

  }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.radius = radius;

    this.shaftToHeadRatioX = shaftToHeadRatioX;
    this.shaftToHeadRatioY = shaftToHeadRatioY;
    this.shaftToHeadWidthRatio = shaftToHeadWidthRatio;
    this.shaftToHeadHeightRatio = shaftToHeadHeightRatio;
    this.shaftToRadiusRatio = shaftToRadiusRatio;

    this.pensiLineToHeadStart = pensiLineToHeadStart;
    this.pensiLineToHeadEnd = pensiLineToHeadEnd;
  }

  drawHead() {
    ctx.beginPath();
    ctx.arc(
      this.x,
      this.y,
      this.height,
      this.width, 
      this.radius, 
      true
    );
    ctx.stroke();
  
    ctx.beginPath();
    ctx.moveTo(this.x * this.pensiLineToHeadStart, this.y)
    ctx.lineTo(this.x * this.pensiLineToHeadEnd, this.y)
    ctx.stroke();
  }

  drawShaft() {
    let x = this.x * this.shaftToHeadRatioX;
    let y = this.y * this.shaftToHeadRatioY;
    let width = this.width * this.shaftToHeadWidthRatio;
    let height = this.height * this.shaftToHeadHeightRatio;
    let radius = this.radius * this.shaftToRadiusRatio;
  
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.arcTo(x, y + height, x + radius, y + height, radius);
    ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
    ctx.arcTo(x + width, y, x + width - radius, y, radius);
    ctx.arcTo(x, y, x, y + radius, radius);
    ctx.stroke();

    // console.log({x, y, width, height})
    let blockoutYRatio = 1.069;

    let blockoutLeftXRatio = 0.75;
    let blockoutLeftWidthRatio = 1.2;
    let blockoutLeftHeightRatio = .88;

    let blockoutRightXRatio = 2.1;
    let blockoutRightWidthRatio = 0.6;
    let blockoutRightHeightRatio = 1;
  
    // left side of the shaft
    ctx.clearRect(
      x * blockoutLeftXRatio,
      y * blockoutYRatio,
      width * blockoutLeftWidthRatio,
      height * blockoutLeftHeightRatio,
    );

    // right side of the shaft
    ctx.clearRect(
      x * blockoutRightXRatio, 
      y * blockoutYRatio, 
      width * blockoutRightWidthRatio, 
      height * blockoutRightHeightRatio
    );
  }

  drawBalls() {
    ctx.beginPath();
    ctx.arc(100, 80, 20, 10, Math.PI * 2, true);
    ctx.arc(140, 80, 20, 10, Math.PI * 2, true);
    ctx.stroke();
  }

  generateRandomPubes() {
    console.log('starting puberty')

    let maxX = 160;
    let minX = 80;

    let maxY = 100;
    let minY = 70;

    for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.moveTo(getRandomNumber(maxX, minX), getRandomNumber(maxY, minY))
        ctx.lineTo(getRandomNumber(maxX, minX), getRandomNumber(maxY, minY))
        ctx.stroke();
      }

    console.log('finish puberty')
  }

  penis() {
    this.drawBalls();
    this.drawShaft();
    this.drawHead();
    this.generateRandomPubes()
  }
}

const peen = new Dick({
  x: 30,
  y: 50,
  height: 20,
  width: 11.6,
  radius: Math.PI * 2.3,
  headToShaftRatio: 1.47 
});

peen.penis();

document.getElementById("drawPubes").addEventListener("click", function (e) {
  peen.generateRandomPubes();
});

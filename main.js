var mainTimer;

var canvasEl;
var now = new Date();
var then = new Date();
var deltatime;
var ctx;
var vector = {
  dotProduct: function(vector1, vector2) {
    var result = 0;
    for (i in vector1) {
      if (vector1.hasOwnProperty(i)) {
        result += vector1[i] * vector2[i];
      }
    }
  },
  summ: function(vector1, vector2) {
    var result = Object.create(vector);
    for (i in vector1) {
      if (vector1.hasOwnProperty(i)) {
        result[i] = vector1[i] * vector2[i];
      }
    }
  },
  lenghtSqr: function() {
    var result;
    for (i in this) {
      if (this.hasOwnProperty(i)) {
        result += this[i] * this[i];
      }
    }
  }
};
var circles = {
  arr: [],
  draw: function() {
    ctx.beginPath();
    ctx.fillStyle = "#000000";
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
    ctx.fill();
    ctx.closePath();
  },
  create: function(specs) {
    var circle = Object.create(circles);
    if (specs) {
      circle.x = specs.x;
      circle.y = specs.y;
      circle.vx = specs.vx;
      circle.vy = specs.vy;
      circle.r = specs.r;
    } else {
      circle.r = Math.random() * 10 + 5;
      circle.x = Math.random() * (ctx.canvas.width - 2 * circle.r) + circle.r;
      circle.y = Math.random() * (ctx.canvas.height - 2 * circle.r) + circle.r;
      circle.vx = Math.random() * 20 - 10;
      circle.vy = Math.random() * 20 - 10;
    }
    circle.mass = (4 * Math.PI * Math.pow(circle.r, 3)) / 3;
    this.arr.push(circle);
  },
  move: function() {
    if (this.x + this.r > ctx.canvas.width && this.vx > 0) {
      this.vx = -this.vx;
    }
    if (this.x - this.r < 0 && this.vx < 0) {
      this.vx = -this.vx;
    }
    if (this.y + this.r > ctx.canvas.height && this.vy > 0) {
      this.vy = -this.vy;
    }
    if (this.y - this.r < 0 && this.vy < 0) {
      this.vy = -this.vy;
    }
    // if (this.x + this.r > ctx.canvas.width || this.x - this.r < 0) {
    //   this.vx = -this.vx;
    // }
    // if (this.y + this.r > ctx.canvas.height || this.y - this.r < 0) {
    //   this.vy = -this.vy;
    // }
    this.x += (this.vx * deltatime) / 100;
    this.y += (this.vy * deltatime) / 100;
  },
  collisionHandler: function(circle1, circle2) {
    var normalVect = Object.create(vector);
    normalVect.x = circle1.x - circle2.x;
    normalVect.y = circle1.y - circle2.y;

    var normalVel1 = Object.create(vector);
    normalVel1.x =
      ((normalVect.x * circle1.vx + normalVect.yx * circle1.vy) /
        normalVect.lenghtsqr) *
      normalVect.x;
    normalVel1.y =
      ((normalVect.x * circle1.vx + normalVect.yx * circle1.vy) /
        normalVect.lenghtsqr) *
      normalVect.y;

      var normalVel2 = Object.create(vector);
      normalVel2.x =
        ((normalVect.x * circle2.vx + normalVect.yx * circle2.vy) /
          normalVect.lenghtsqr) *
        normalVect.x;
      normalVel2.y =
        ((normalVect.x * circle2.vx + normalVect.yx * circle2.vy) /
          normalVect.lenghtsqr) *
        normalVect.y;
  }
};

function drawLoop() {
  now = then;
  then = new Date();
  deltatime = +then - +now;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
  ctx.fill();
  circles.arr.forEach(circle => {
    circle.move();
    ctx.beginPath();
    ctx.fillStyle = "#000000";
    ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI, true);
    ctx.fill();
  });
}

function initJS() {
  mainTimer = setInterval(drawLoop, 10);

  canvasEl = document.getElementById("el");
  ctx = canvasEl.getContext("2d");
  for (let i = 0; i < 10; i++) {
    circles.create();
  }
}

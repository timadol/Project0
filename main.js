var mainTimer;

var canvasEl;
var now = new Date();
var then = new Date();
var deltatime;
var ctx;
var GRAVITY = 10;
var vector = {
  dotProduct: function(vector1, vector2) {
    var result = 0;
    for (i in vector1) {
      if (vector1.hasOwnProperty(i)) {
        result += vector1[i] * vector2[i];
      }
    }
    return result;
  },

  multyply: function(vector, a) {
    var result = Object.create(vector);
    for (i in vector) {
      if (vector.hasOwnProperty(i)) {
        result[i] = vector[i] * a;
      }
    }
  },

  summ: function(vector1, vector2) {
    var result = Object.create(vector);
    for (i in vector1) {
      if (vector1.hasOwnProperty(i)) {
        result[i] = vector1[i] + vector2[i];
      }
    }
    return result;
  },

  subtract: function(vector1, vector2) {
    var result = Object.create(vector);
    for (i in vector1) {
      if (vector1.hasOwnProperty(i)) {
        result[i] = vector1[i] - vector2[i];
      }
    }
    return result;
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
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI, true);
    ctx.fill();
    ctx.closePath();
  },

  create: function(specs) {
    var circle = Object.create(circles);
    circle.pos = Object.create(vector);
    circle.vel = Object.create(vector);
    if (specs) {
      circle.pos.x = specs.x;
      circle.pos.y = specs.y;
      circle.vel.x = specs.vel.x;
      circle.vel.y = specs.vel.y;
      circle.r = specs.r;
    } else {
      circle.r = Math.random() * 10 + 5;
      circle.pos.x =
        Math.random() * (ctx.canvas.width - 2 * circle.r) + circle.r;
      circle.pos.y =
        Math.random() * (ctx.canvas.height - 2 * circle.r) + circle.r;
      circle.vel.x = Math.random() * 20 - 10;
      circle.vel.y = Math.random() * 20 - 10;
    }
    circle.mass = (4 * Math.PI * Math.pow(circle.r, 3)) / 3;
    this.arr.push(circle);
  },

  move: function() {
    if (this.pos.x + this.r > ctx.canvas.width && this.vel.x > 0) {
      this.vel.x = -this.vel.x;
    }
    if (this.pos.x - this.r < 0 && this.vel.x < 0) {
      this.vel.x = -this.vel.x;
    }
    if (this.pos.y + this.r > ctx.canvas.height && this.vel.y > 0) {
      this.vel.y = -this.vel.y;
    }
    if (this.pos.y - this.r < 0 && this.vel.y < 0) {
      this.vel.y = -this.vel.y;
    }
    // if (this.x + this.r > ctx.canvas.width || this.x - this.r < 0) {
    //   this.vel.x = -this.vel.x;
    // }
    // if (this.y + this.r > ctx.canvas.height || this.y - this.r < 0) {
    //   this.vel.y = -this.vel.y;
    // }
    this.pos.x += (this.vel.x * deltatime) / 100;
    this.pos.y += (this.vel.y * deltatime) / 100;
    //this.vel.x += (GRAVITY * deltatime) / 100;
    this.vel.y += (GRAVITY * deltatime) / 100;
  },

  collisionHandler: function(circle1, circle2) {
    var normalVect = Object.create(vector);
    normalVect = vector.subtract(circle1, circle2);

    var normalVel1 = Object.create(vector);
    normalVel1.x =
      (vector.dotProduct(circle1.vel, normalVect) / normalVect.lenghtSqr) *
      normalVect.x;
    normalVel1.y =
      (vector.dotProduct(circle1.vel, normalVect) / normalVect.lenghtSqr) *
      normalVect.y;

    var normalVel2 = Object.create(vector);
    normalVel2.x =
      (vector.dotProduct(circle2.vel, normalVect) / normalVect.lenghtSqr) *
      normalVect.x;
    normalVel2.y =
      (vector.dotProduct(circle2.vel, normalVect) / normalVect.lenghtSqr) *
      normalVect.y;

    circle1.vel = vector.subtract(circle1.vel, normalVel1);
    circle2.vel = vector.subtract(circle2.vel, normalVel2);

    var vel1 =
      (2 * circle2.mass * Math.sqrt(normalVel2.lenghtSqr) +
        (circle1.mass - circle2.mass) * Math.sqrt(normalVel1.lenghtSqr)) /
      (circle1.mass + circle2.mass);
    var vel2 =
      (2 * circle1.mass * Math.sqrt(normalVel1.lenghtSqr) +
        (circle2.mass - circle1.mass) * Math.sqrt(normalVel2.lenghtSqr)) /
      (circle1.mass + circle2.mass);
    normalVel1 = vector.multyply(normalVel1,vel1);
    normalVel2 = vector.multyply(normalVel2,vel2);

    circle1.vel = vector.summ(circle1.vel, normalVel1);
    circle2.vel = vector.summ(circle2.vel, normalVel2);
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
    ctx.arc(circle.pos.x, circle.pos.y, circle.r, 0, 2 * Math.PI, true);
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

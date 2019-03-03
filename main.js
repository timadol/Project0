var mainTimer;

var canvasEl;
var now = new Date();
var then = new Date();
var deltatime;
var ctx;
var GRAVITY = 0;
var VELOCITY = 10;
var RADIUS = 10;
var TIME_MULTIPLIER = 20;
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
    return result;
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
    var result = 0;
    for (i in this) {
      if (this.hasOwnProperty(i)) {
        result += this[i] * this[i];
      }
    }
    return result;
  },
  normalize: function() {
    var result = 0;
    for (i in this) {
      if (this.hasOwnProperty(i)) {
        this[i] = this[i] / Math.sqrt(this.lenghtSqr());
      }
    }
  }
};
var circles = {
  arr: [],
  draw: function() {
    ctx.beginPath();
    ctx.fillStyle = "#000000";
    ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI, true);
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
      circle.vel.x = specs.vx;
      circle.vel.y = specs.vy;
      circle.r = specs.r;
    } else {
      circle.r = Math.random() * RADIUS * 2 + RADIUS;
      circle.pos.x =
        Math.random() * (ctx.canvas.width - 2 * circle.r) + circle.r;
      circle.pos.y =
        Math.random() * (ctx.canvas.height - 2 * circle.r) + circle.r;
      circle.vel.x = Math.random() * VELOCITY * 2 - VELOCITY;
      circle.vel.y = Math.random() * VELOCITY * 2 - VELOCITY;
    }
    circle.mass = Math.PI * Math.pow(circle.r, 2);
    circle.justColidedWith = NaN;
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

    this.pos.x += (this.vel.x * deltatime) / 100;
    this.pos.y += (this.vel.y * deltatime) / 100;
    this.vel.y += (GRAVITY * deltatime) / 100;
  },

  collisionDetector: function() {
    for (let i = 0; i < this.arr.length; i++) {
      for (let j = i + 1; j < this.arr.length; j++) {
        var temp1 = this.arr[i];
        var temp2 = this.arr[j];
        var vec = vector.subtract(temp1.pos, temp2.pos);
        var distance = Math.sqrt(vec.lenghtSqr());
        if (distance < temp1.r + temp2.r) {
          this.collisionHandler(temp1, temp2);
        }
      }
    }
  },

  collisionHandler: function(circle1, circle2) {
    var normalVect = Object.create(vector);
    normalVect = vector.subtract(circle1.pos, circle2.pos);
    var distance = Math.sqrt(normalVect.lenghtSqr());
    normalVect.normalize();

    //overlap resolving
    circle1.pos = vector.summ(
      circle1.pos,
      vector.multyply(
        normalVect,
        (-(distance - circle1.r - circle2.r) * circle1.mass) /
          (circle1.mass + circle2.mass)
      )
    );
    circle2.pos = vector.summ(
      circle2.pos,
      vector.multyply(
        normalVect,
        ((distance - circle1.r - circle2.r) * circle2.mass) /
          (circle1.mass + circle2.mass)
      )
    );

    var normalVel1 = Object.create(vector);
    normalVel1 = vector.multyply(
      normalVect,
      vector.dotProduct(circle1.vel, normalVect)
    );

    var normalVel2 = Object.create(vector);
    normalVel2 = vector.multyply(
      normalVect,
      vector.dotProduct(circle2.vel, normalVect)
    );

    circle1.vel = vector.subtract(circle1.vel, normalVel1);
    circle2.vel = vector.subtract(circle2.vel, normalVel2);

    var vel1 = vector.dotProduct(normalVel1, normalVect);
    var vel2 = -vector.dotProduct(normalVel2, normalVect);

    

    var temp;
    var totalMass = circle1.mass + circle2.mass;
    var diffMass = circle1.mass - circle2.mass;
    temp = (2 * circle2.mass * vel2 - diffMass * vel1) / totalMass;
    vel2 = (2 * circle1.mass * vel1 + diffMass * vel2) / totalMass;
    vel1 = temp;

    normalVel1 = vector.multyply(normalVect, vel1);
    normalVel2 = vector.multyply(normalVect, vel2);

    circle1.vel = vector.subtract(circle1.vel, normalVel1);
    circle2.vel = vector.subtract(circle2.vel, normalVel2);
  }
};

function drawLoop() {
  now = then;
  then = new Date();
  deltatime = TIME_MULTIPLIER;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
  //ctx.fill();
  ctx.strokeRect(0, 0, canvasEl.width, canvasEl.height);
  circles.collisionDetector();
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
  // for (let i = 0; i < 3; i++) {
  //   circles.create();
  // }

  circles.create({
    x: 300,
    y: 200,
    vy: 0,
    vx: 1,
    r: 20
  });
  circles.create({
    x: 50,
    y: 200,
    vy: 0,
    vx: 10,
    r: 20
  });
}

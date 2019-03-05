var mainTimer;
var totalEnergy;
var totalKineticEnergy;

var canvasEl;
var now = new Date();
var then = new Date();
var deltatime;
var ctx;
var gravity = 0.2;
var VELOCITY = 10;
var radius = 0.5;
var TIME_MULTIPLIER = 1 / 2;
var K_BOLCMAN = 1.38064852e-38;

var SliderValue = 5000;

function rgbToHex(R, G, B) {
  return "#" + toHex(R) + toHex(G) + toHex(B);
}

function toHex(n) {
  n = parseInt(n, 10);
  if (isNaN(n)) return "00";
  n = Math.max(0, Math.min(n, 255));
  return (
    "0123456789ABCDEF".charAt((n - (n % 16)) / 16) +
    "0123456789ABCDEF".charAt(n % 16)
  );
}

var vector = {
  dotProduct: function(vector1, vector2) {
    return vector1.x * vector2.x + vector1.y * vector2.y;
  },

  multyply: function(vector, a) {
    var result = Object.create(vector);
    result.x = vector.x * a;
    result.y = vector.y * a;
    return result;
  },

  summ: function(vector1, vector2) {
    var result = Object.create(vector);
    result.x = vector1.x + vector2.x;
    result.y = vector1.y + vector2.y;
    return result;
  },

  subtract: function(vector1, vector2) {
    var result = Object.create(vector);
    result.x = vector1.x - vector2.x;
    result.y = vector1.y - vector2.y;
    return result;
  },

  lenghtSqr: function() {
    return vector.dotProduct(this, this);
  },
  normalize: function() {
    var lenght = Math.sqrt(this.lenghtSqr());
    this.x /= lenght;
    this.y /= lenght;
  }
};
var circles = {
  arr: [],
  draw: function() {
    ctx.beginPath();
    ctx.fillStyle = this.backgroundColor;
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
      circle.r = Math.random() * radius * 2 + radius;
      circle.pos.x =
        Math.random() * (ctx.canvas.width - 2 * circle.r) + circle.r;
      circle.pos.y =
        Math.random() * (ctx.canvas.height - 2 * circle.r) + circle.r;
      circle.vel.x = Math.random() * VELOCITY * 2 - VELOCITY;
      circle.vel.y = Math.random() * VELOCITY * 2 - VELOCITY;
    }
    circle.mass = Math.PI * Math.pow(circle.r, 2);
    circle.backgroundColor = rgbToHex(
      Math.round(((circle.r / 3) * radius - 1) * 100 + 155),
      Math.round(((circle.r / 3) * radius - 1) * 100 + 155),
      Math.round(((circle.r / 3) * radius - 1) * 100 + 155)
    );
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

    this.pos.x += this.vel.x * deltatime;
    this.pos.y +=
      this.vel.y * deltatime + (gravity * deltatime * deltatime) / 2;
    this.vel.y += gravity * deltatime;
  },

  collisionDetector: function() {
    for (let i = 0; i < this.arr.length; i++) {
      for (let j = i + 1; j < this.arr.length; j++) {
        var temp1 = this.arr[i];
        var temp2 = this.arr[j];
        var deltaX = Math.abs(temp1.pos.x - temp2.pos.x);
        var deltaY = Math.abs(temp1.pos.y - temp2.pos.y);
        if (deltaX < temp1.r + temp2.r && deltaY < temp1.r + temp2.r) {
          var distance = deltaX * deltaX + deltaY * deltaY;
          if (distance < (temp1.r + temp2.r) * (temp1.r + temp2.r)) {
            this.collisionHandler(temp1, temp2);
          }
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
        (-(distance - circle1.r - circle2.r - 1) * circle1.mass) /
          (circle1.mass + circle2.mass)
      )
    );
    circle2.pos = vector.summ(
      circle2.pos,
      vector.multyply(
        normalVect,
        ((distance - circle1.r - circle2.r - 1) * circle2.mass) /
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
    var vel2 = vector.dotProduct(normalVel2, normalVect);

    //Проекции скоростей
    var totalMass = circle1.mass + circle2.mass;
    var diffMass = circle1.mass - circle2.mass;
    var vel11 = (2 * circle2.mass * vel2 + diffMass * vel1) / totalMass;
    var vel21 = (2 * circle1.mass * vel1 - diffMass * vel2) / totalMass;

    normalVel1 = vector.multyply(normalVect, vel11);
    normalVel2 = vector.multyply(normalVect, vel21);

    circle1.vel = vector.summ(circle1.vel, normalVel1);
    circle2.vel = vector.summ(circle2.vel, normalVel2);
  }
};

function drawLoop() {
  now = then;
  then = new Date();
  deltatime = TIME_MULTIPLIER;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

  //
  ctx.strokeRect(0, 0, canvasEl.width, canvasEl.height);
  circles.collisionDetector();
  totalEnergy = 0;
  totalKineticEnergy = 0;
  circles.arr.forEach(circle => {
    var kinectic = (circle.mass * circle.vel.lenghtSqr()) / 2;
    var potential = -circle.mass * gravity * circle.pos.y;
    var tempEng = kinectic + potential;
    totalKineticEnergy += kinectic;
    totalEnergy += tempEng;
    circle.move();
    circle.draw();
  });
  // Вывод отладочной информации
  ctx.fillStyle = "#000000";
  ctx.fillText("Энергия: " + Math.round(totalEnergy), 5, 10);
  ctx.fillText("Кол-во: " + circles.arr.length, 5, 20);
  ctx.fillText("FPS: " + Math.round(1000 / (then - now)), 5, 30);
  ctx.fillText(
    "T: " + Math.round(totalKineticEnergy / (10 * SliderValue)),
    5,
    40
  );
}

function initJS() {
  canvasEl = document.getElementById("el");
  mainTimer = setInterval(drawLoop, 20);
  $("#countSlider-value").html(SliderValue);
  resetScene();

  $(function() {
    $("#countSlider").slider({
      value: SliderValue,
      min: 10,
      max: 5000,
      step: 1
    });
  });
  $(function() {
    $("#radiusSlider").slider({
      value: radius,
      min: 0.5,
      max: 5,
      step: 0.01
    });
  });
  $(function() {
    $("#gravitySlider").slider({
      value: gravity,
      min: 0,
      max: 5,
      step: 1 / 50
    });
  });

  $("#countSlider").on("slidechange", function(event, ui) {
    SliderValue = $("#countSlider").slider("option", "value");
    $("#countSlider-value").html(SliderValue);
    resetScene();
  });
  $("#radiusSlider").on("slidechange", function(event, ui) {
    radius = $("#radiusSlider").slider("option", "value");
    $("#radiusSlider-value").html(radius);
    resetScene();
  });
  $("#gravitySlider").on("slidechange", function(event, ui) {
    gravity = $("#gravitySlider").slider("option", "value");
    $("#gravitySlider-value").html(gravity);
  });

  $("#reset-button").click(function(event, ui) {
    resetScene();
  });
}

function resetScene() {
  circles.arr = [];

  ctx = canvasEl.getContext("2d");
  for (let i = 0; i < SliderValue; i++) {
    circles.create();
  }
  //   circles.create({
  //     x: 300,
  //     y: 200,
  //     vy: 0,
  //     vx: -10,
  //     r: 20
  //   });
  //   circles.create({
  //   x: 20,
  //   y: 200,
  //   vy: 0,
  //   vx: 10,
  //   r: 14
  // });
}

// circles.create({
//   x: 20,
//   y: 200,
//   vy: 0,
//   vx: 10,
//   r: 20
// });

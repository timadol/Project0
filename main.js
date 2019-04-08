/*
 * @Author: Timofey Dolgunichev
 * @Last Modified by: Kirill Dolgunichev
 * @Last Modified time: 2019-04-08 03:18:52
 */

// debug info
// let mainTimer;
let totalEnergy;
let totalKineticEnergy;
// defaults
let radius = 1;
const mass = 10;
let objectQty = 1500;
let gravity = 0.2;
let trail = 90;
// constants
const cFillBaseColor = '#ffffff';
const VELOCITY = 10;
const TIME_MULTIPLIER = 1 / 2;
// const Kb = 1.38064852e-38;
const PI2 = 2 * Math.PI;
// globals
let canvasEl;
let now = new Date();
let then = new Date();
let deltaTime;
let ctx;
let operationCount = 0;

/**
 * Convert a RGB value to a hexadecimal value
 * @param {int} R The red value.
 * @param {int} G The green value.
 * @param {int} B The blue value.
 * @return {string} RGB color representation in HEX format
 */
function rgbToHex(R, G, B) {
  return '#' + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
}

const vector = {
  dotProduct: function(vector1, vector2) {
    return vector1.x * vector2.x + vector1.y * vector2.y;
  },

  multiply: function(vector, a) {
    const result = Object.create(vector);
    result.x = vector.x * a;
    result.y = vector.y * a;
    return result;
  },

  sum: function(vector1, vector2) {
    const result = Object.create(vector);
    result.x = vector1.x + vector2.x;
    result.y = vector1.y + vector2.y;
    return result;
  },

  subtract: function(vector1, vector2) {
    const result = Object.create(vector);
    result.x = vector1.x - vector2.x;
    result.y = vector1.y - vector2.y;
    return result;
  },

  lengthSqr: function() {
    return vector.dotProduct(this, this);
  },
  normalize: function() {
    const length = Math.sqrt(this.lengthSqr());
    this.x /= length;
    this.y /= length;
  },
};

const circles = {
  arr: [],
  compare: function(a, b) {
    operationCount++;
    return a.pos.y - a.r - (b.pos.y - b.r);
  },
  find: function(element, arr) {
    operationCount++;
    const midIndex = Math.trunc(arr.length / 2);
    const midEl = arr[midIndex];
    if (midIndex == 0) return 0;
    if (midEl.pos.y - midEl.r > element) {
      return this.find(element, arr.slice(0, midIndex));
    }
    if (midEl.pos.y - midEl.r < element) {
      return midIndex + this.find(element, arr.slice(midIndex, arr.length));
    }
    return midIndex;
  },
  draw: function() {
    ctx.beginPath();
    ctx.fillStyle = this.backgroundColor;
    ctx.arc(Math.round(this.pos.x),
        Math.round(this.pos.y),
        Math.round(this.r),
        0, PI2, true);
    ctx.fill();
    ctx.closePath();
  },

  create: function(specs) {
    const circle = Object.create(circles);
    circle.pos = Object.create(vector);
    circle.vel = Object.create(vector);
    if (specs) {
      circle.pos.x = specs.x;
      circle.pos.y = specs.y;
      circle.vel.x = specs.vx;
      circle.vel.y = specs.vy;
      circle.r = specs.r;
    } else {
      circle.r = radius;
      circle.pos.x =
        Math.random() * (ctx.canvas.width - 2 * circle.r) + circle.r;
      circle.pos.y =
        Math.random() * (ctx.canvas.height - 2 * circle.r) + circle.r;
      circle.vel.x = Math.random() * VELOCITY * 2 - VELOCITY;
      circle.vel.y = Math.random() * VELOCITY * 2 - VELOCITY;
    }
    circle.mass = Math.random() * mass * 9 + mass;
    const massMax = 10 * mass;
    // const massMin = mass;
    circle.backgroundColor = rgbToHex(
        Math.round((1 - circle.mass / massMax) * 255),
        0,
        Math.round((circle.mass / massMax) * 255)
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

    this.pos.x += this.vel.x * deltaTime;
    this.pos.y +=
      this.vel.y * deltaTime + (gravity * deltaTime * deltaTime) / 2;
    this.vel.y += gravity * deltaTime;
  },

  collisionDetector: function() {
    this.arr.sort(this.compare);
    for (let i = 0; i < this.arr.length; i++) {
      const temp1 = this.arr[i];
      const sliceIndex = this.find(temp1.pos.y + temp1.r, this.arr);
      for (let j = i+1; j < sliceIndex; j++) {
        const temp2 = this.arr[j];
        operationCount++;
        const deltaX = Math.abs(temp1.pos.x - temp2.pos.x);
        const deltaY = Math.abs(temp1.pos.y - temp2.pos.y);
        if (deltaX < temp1.r + temp2.r && deltaY < temp1.r + temp2.r) {
          const distance = deltaX * deltaX + deltaY * deltaY;
          if (distance < (temp1.r + temp2.r) * (temp1.r + temp2.r)) {
            this.collisionHandler(temp1, temp2);
          }
        }
      }
    }
  },

  collisionHandler: function(circle1, circle2) {
    let normal = Object.create(vector);
    normal = vector.subtract(circle1.pos, circle2.pos);
    const distance = Math.sqrt(normal.lengthSqr());
    normal.normalize();

    // overlap resolving
    circle1.pos = vector.sum(
        circle1.pos,
        vector.multiply(
            normal,
            (-(distance - circle1.r - circle2.r - 1) * circle1.mass) /
          (circle1.mass + circle2.mass) // todo: Магия! Надо разобраться.
        )
    );
    circle2.pos = vector.sum(
        circle2.pos,
        vector.multiply(
            normal,
            ((distance - circle1.r - circle2.r - 1) * circle2.mass) /
          (circle1.mass + circle2.mass) // todo: Магия! Надо разобраться.
        )
    );

    let normalVel1 = Object.create(vector);
    normalVel1 = vector.multiply(
        normal,
        vector.dotProduct(circle1.vel, normal)
    );

    let normalVel2 = Object.create(vector);
    normalVel2 = vector.multiply(
        normal,
        vector.dotProduct(circle2.vel, normal)
    );

    circle1.vel = vector.subtract(circle1.vel, normalVel1);
    circle2.vel = vector.subtract(circle2.vel, normalVel2);

    const vel1 = vector.dotProduct(normalVel1, normal);
    const vel2 = vector.dotProduct(normalVel2, normal);

    // Проекции скоростей
    const totalMass = circle1.mass + circle2.mass;
    const diffMass = circle1.mass - circle2.mass;
    const vel11 = (2 * circle2.mass * vel2 + diffMass * vel1) / totalMass;
    const vel21 = (2 * circle1.mass * vel1 - diffMass * vel2) / totalMass;

    normalVel1 = vector.multiply(normal, vel11);
    normalVel2 = vector.multiply(normal, vel21);

    circle1.vel = vector.sum(circle1.vel, normalVel1);
    circle2.vel = vector.sum(circle2.vel, normalVel2);
  },
};
/**
 * todo: JDoc comment
 *
 */
function drawLoop() {
  clearScene(trail);

  now = then;
  then = new Date();
  deltaTime = TIME_MULTIPLIER;

  operationCount =0;
  totalEnergy = 0;
  totalKineticEnergy = 0;

  circles.collisionDetector();

  circles.arr.forEach((circle) => {
    const kinetic = (circle.mass * circle.vel.lengthSqr()) / 2;
    const potential = -circle.mass * gravity * circle.pos.y;
    const tempEng = kinetic + potential;
    totalKineticEnergy += kinetic;
    totalEnergy += tempEng;
    circle.move();
    circle.draw();
  });
  // Вывод отладочной информации
  const textSize = 12;
  ctx.fillStyle = '#00ffff99';
  ctx.fillRect(2, 1, 120, 50);
  ctx.fillStyle = '#8b0000ff';
  ctx.font = textSize + 'px Arial';
  ctx.fillText('Энергия: ' + Math.round(totalEnergy), 5, 10);
  ctx.fillText( 'T: ' + Math.round(totalKineticEnergy / (10 * objectQty)),
      5, 20);
  ctx.fillText('Кол-во: ' + circles.arr.length, 5, 30);
  ctx.fillText('FPS: ' + Math.round(1000 / (then - now)),
      5, 40);
  ctx.fillText('Operations: ' + operationCount, 5, 50);
}
/**
 * @param {object} _ev Nothing.
 */
window.onload = function(_ev) {
  canvasEl = document.getElementById('el');
  mainTimer = setInterval(drawLoop, 20);
  $('#countSlider-value').html(objectQty);
  resetScene();

  $(function() {
    $('#countSlider').slider({
      value: objectQty,
      min: 10,
      max: 10000,
      step: 1,
    });
  });
  $(function() {
    $('#radiusSlider').slider({
      value: radius,
      min: 0.5,
      max: 5,
      step: 0.01,
    });
  });
  $(function() {
    $('#gravitySlider').slider({
      value: gravity,
      min: 0,
      max: 5,
      step: 1 / 50,
    });
  });
  $(function() {
    $('#trailSlider').slider({
      value: trail,
      min: 0,
      max: 255,
      step: 5,
    });
  });

  $('#countSlider-value').html(objectQty);
  $('#radiusSlider-value').html(radius);
  $('#gravitySlider-value').html(gravity);
  $('#trailSlider-value').html(trail);

  $('#countSlider').on('slidechange', function() {
    objectQty = $('#countSlider').slider('option', 'value');
    $('#countSlider-value').html(objectQty);
    resetScene();
  });

  $('#radiusSlider').on('slidechange', function() {
    radius = $('#radiusSlider').slider('option', 'value');
    $('#radiusSlider-value').html(radius);
    resetScene();
  });

  $('#gravitySlider').on('slidechange', function() {
    gravity = $('#gravitySlider').slider('option', 'value');
    $('#gravitySlider-value').html(gravity);
  });

  $('#trailSlider').on('slidechange', function() {
    trail = $('#trailSlider').slider('option', 'value');
    $('#trailSlider-value').html(trail);
  });

  $('#reset-button').on('click', function() {
    resetScene();
  });
};
/**
 * Clear scene.
 */
function resetScene() {
  circles.arr = [];
  ctx = canvasEl.getContext('2d');
  clearScene(0);
  for (let i = 0; i < objectQty; i++) {
    circles.create();
  }
}
/**
 * Special effects, yeahhh!
 * @param {int} trailValue Amount of 'trail' effect.
 */
function clearScene(trailValue) {
  const fillTransparency = trailValue.toString(16);
  ctx.fillStyle = cFillBaseColor + fillTransparency;
  ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
}

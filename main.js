var mainTimer;

var canvasEl;
var ctx;
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
    var circle = Object(circles);
    if (specs) {
      circle.x = specs.x;
      circle.y = specs.y;
      circle.vx = specs.vx;
      circle.vy = specs.vy;
      circle.r = specs.r;
    } else {
      circle.r = 20;
      // circle.x = circle.r + Math.random() * (ctx.width - 2 * circle.r);
      // circle.y = circle.r + Math.random() * (ctx.width - 2 * circle.r);
      circle.x = 100;
      circle.y = 100;
      circle.vx = Math.random() * 20 - 10;
      circle.vy = Math.random() * 20 - 10;
    }
    this.arr.push(circle);
  },
  move: function() {
    if (this.x + this.r >= ctx.canvas.width || this.x - this.r < 0) {
      this.vx = -this.vx;
    }
    if (this.y + this.r >= ctx.canvas.height || this.y - this.r < 0) {
      this.vy = -this.vy;
    }
    this.x += this.vx;
    this.y += this.vy;
  }
};

function drawLoop() {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
  ctx.beginPath();
  ctx.fillStyle = "#000000";
  ctx.arc(circles.arr[0].x, circles.arr[0].y, circles.arr[0].r, 0, 2 * Math.PI, true);
  ctx.fill();
  circles.arr.forEach(circle => {
    circle.move();
    //circle.draw();
  });
}

function initJS() {
  mainTimer = setInterval(drawLoop, 20);

  canvasEl = document.getElementById("el");
  ctx = canvasEl.getContext("2d");
  circles.create();
}

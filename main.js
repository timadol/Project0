var mainTimer;

var canvasEl;
var ctx;
var circles = {
  arr: [],
  draw: function(circle) {
    ctx.beginPath();
    ctx.fillStyle = "#000000";
    ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI, true);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(
      circle.x + circle.radius / 5,
      circle.y - circle.radius / 5,
      circle.radius / 5,
      0,
      2 * Math.PI,
      true
    );
    ctx.fillStyle = "#808080";
    ctx.fill();
    ctx.fillStyle = "#000000";
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
      circle.vx = Math.random() * 20;
      circle.vy = Math.random() * 20;
    }
    this.arr.push(circle);
  },
  move: function(circle) {
    if (circle.x + circle.r > ctx.width || circle.x - circle.r < 0) {
      circle.vx = -circle.vx;
    }
    if (circle.y + circle.r > ctx.height || circle.x - circle.r < 0) {
      circle.vy = -circle.vy;
    }
    circle.x += circle.vx;
    circle.y += circle.vy;
  }
};

function drawLoop() {
  // canvasEl.style.background =
  //   (canvasEl.style.background  != "black") ? "black" : "white";
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
  circles.arr.forEach(circle => {
    circles.draw(circle);
  });
  circles.arr.forEach(circle => {
    circles.move(circle);
  });
}

function initJS() {
  mainTimer = setInterval(drawLoop, 1000);

  canvasEl = document.getElementById("el");
  ctx = canvasEl.getContext("2d");
  circles.create();
  // circle = {
  //   x: canvasEl.width / 2,
  //   y: canvasEl.height / 2,
  //   vx: 10,
  //   vy: 20,
  //   r: 40,
  //   move: function() {
  //         earase(ctx, circle);
  //         circle.x += circle.vx;
  //         circle.y += circle.vy;
  //         draw(ctx, circle);
  //     }
  // };
}

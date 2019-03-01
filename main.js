var mainTimer;

var el;
var ctx;

var circle0 = {};

var circle = {};
circle.x = 100;
circle.y = 100;
circle.vx = 10;
circle.vy = 20;
circle.radius = 40;

function drawLoop() {
  ctx.clearRect(0, 0, el.width, el.height);
  
}

function initJS() {
  mainTimer = setInterval(drawLoop, 1000);

  el = document.getElementById("el");
  ctx = el.getContext("2d");

  circle0 = {
    x: el.width / 2,
    y: el.height / 2,
    vx: 10,
    vy: 20,
    r: 40,
    func: function(params) {
      alert(params);
    }
  };

  circle0.func("Hello");

  alert();
}

//   var example = document.getElementById("example");
//   var ctx = example.getContext("2d");

//   example.width = 640;
//   example.height = 480;
//   ctx.strokeRect(0, 0, 640, 480);

//   function draw(ctx, circle) {
//     ctx.beginPath();
//     ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI, true);
//     ctx.fill();
//     ctx.beginPath();
//     ctx.arc(
//       circle.x + circle.radius / 5,
//       circle.y - circle.radius / 5,
//       circle.radius / 5,
//       0,
//       2 * Math.PI,
//       true
//     );
//     ctx.fillStyle =#808080";
//     ctx.fill();
//     ctx.fillStyle =#000000";
//   }
//   function earase(ctx, circle) {
//     ctx.beginPath();
//     ctx.fillStyle =#ffffff";
//     ctx.arc(circle.x, circle.y, circle.radius + 1, 0, 2 * Math.PI, true);
//     ctx.fill();
//     ctx.fillStyle =#000000";
//   }
/*while(true)
        {
            if((circle.x+circle.radius)>640 || (circle.x-circle.radius)<0)
            {
                circle.vx=-circle.vx;
            }
            if((circle.y+circle.radius)>480 || (circle.y-circle.radius)<0)
            {
                circle.vy=-circle.vy;
            }
            window.setInterval(function() {circle.x+=circle.vx;
            circle.y+=circle.vy;},1000)
            draw(ctx,circle);
        }*/
// function pausecomp(millis) {
//     var date = new Date();
//     var curDate = null;
//     do { curDate = new Date(); }
//     while (curDate - date < millis);
// }
// draw(ctx, circle);
// function move() {
//     earase(ctx, circle);
//     circle.x += circle.vx;
//     circle.y += circle.vy;
//     draw(ctx, circle);
// }
// var counter = 5;
// var startTime = new Date();

//   while (true) {
//   var stopTime = new Date();
//   setTimeout(alert("time elapsed:" + +(stopTime - startTime)), 1000);
// pausecomp(100);
// alert("time elapsed:" + +(stopTime - startTime));
//}
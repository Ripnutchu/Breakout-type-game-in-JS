const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 0;
let dy = 0;
let cnt = 0;

const blocksX = 5;
const blocksY = 5;

let speed = 5;

class block{
  posX;
  posY;
  sizeX;
  sizeY;
  active;

  constructor()
  {
    this.posX = 0;
    this.posY = 0;
    this.sizeX = 0;
    this.sizeY = 0;
    this.active = true;
  }
  Draw(ctx) {
    if (this.active == false)
      return;
    ctx.beginPath();
    ctx.fillStyle = "rgb(255, 0, 0)";
    ctx.fillRect(this.posX, this.posY, this.sizeX, this.sizeY);    
    ctx.fill();
    // stavi outline
    ctx.closePath();
  }
} 

let blocks = {};
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  for (i = 0; i < blocksX; i++)
    for (j = 0; j < blocksY; j++)
      blocks[i * 100 + j].Draw(ctx);

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  }
  if (y + dy > canvas.height - ballRadius){
    x=canvas.width / 2;
    y=canvas.height - 30;
    dx=0;
    dy=0;
    cnt=0;
  }

  x += dx * speed;
  if (coll())
    dx = -dx;
  y += dy * speed;
  if (coll())
    dy = -dy;
  speed /= 1.005;
  speed = Math.max(2, speed);
    
}

function getMousePosition(canvas, event) {
            if (cnt != 1)
          {          
            let rect = canvas.getBoundingClientRect();
            let x_coord = event.clientX - rect.left;
            let y_coord = event.clientY - rect.top;
            console.log("Coordinate x: " + x_coord, "Coordinate y: " + y_coord);
            let diff_x = x_coord - x;
            let diff_y = y_coord - y;
            let mag = Math.sqrt(diff_x * diff_x + diff_y * diff_y);
            diff_x /= mag;
            diff_y /= mag;
            speed = 5;
            dx=diff_x;
            dy=diff_y;

            x+=dx;
            y+=dy;
          }
        }
 
        let canvasElem = document.querySelector("canvas");
 
        canvasElem.addEventListener("mousedown", function (e) {
            getMousePosition(canvasElem, e);
             cnt = 1;
}); 

function startGame() {
  const interval = setInterval(draw, 10);
  for (i = 0; i < blocksX; i++)
  {
    for (j = 0; j < blocksY; j++)
    {
      blocks[i * 100 + j] = new block();
      blocks[i * 100 + j].sizeX = (canvas.width - 10) / blocksX - 10;
      blocks[i * 100 + j].sizeY = 20;
      blocks[i * 100 + j].posX = 10 + i * (blocks[i].sizeX + 10);
      blocks[i * 100 + j].posY = 10 + j * 30;
      blocks[i * 100 + j].active = true;
    }
  }

  for (i=0; i<5; i++)
  {
    ran_x = Math.round(Math.random()*5);
    ran_y = Math.round(Math.random()*5);
    console.log("X: " + ran_x); 
    console.log("Y: " + ran_y);
    kill(ran_x * 100 + ran_y);
  }

}

function kill(id)
{
  blocks[id].active = false;
  blocks[id].sizeX = 0;
  blocks[id].sizeY = 0; 
}

function BBcoll(x1, y1, w1, h1, x2, y2, w2, h2)
{
  var interLeft = Math.max(x1, x2);
  var interRight = Math.min(x1 + w1, x2 + w2);
  var interTop = Math.max(y1, y2);
  var interBottom = Math.min(y1 + h1, y2+h2);
  if (interLeft < interRight && interTop < interBottom)
  return true;
return false;
}

function coll()
{
  for (i = 0; i < blocksX; i++)
  {
      for (j = 0; j < blocksY; j++)
      {
        if (blocks[i * 100 + j].active == false)
          continue;
        if (BBcoll(blocks[i * 100 + j].posX, blocks[i * 100 + j].posY,
          blocks[i * 100 + j].sizeX, blocks[i * 100 + j].sizeY, 
          x - ballRadius, y - ballRadius, ballRadius * 2, ballRadius * 2))
        {
          kill (i * 100 + j);
          return true;
        }
      }
}
return false;
}

window.addEventListener("load", function () {
  startGame();
  this.disabled = true;
});


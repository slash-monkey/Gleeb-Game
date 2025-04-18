const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let block = { x: 80, y: canvas.height / 2 - 50, width: 20, height: 100, speed: 5 };
let gleebs = [];
let keys = {};
let timeLeft = 120;
let missed = 0;
let killed = 0;
let gameOver = false;
let finalScore = 0;
let playerName = prompt("Enter your name:");

const gleebImg = new Image();
gleebImg.src = "https://codehs.com/uploads/10f3bda498e09978f1ac85e29f30ef7d";

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function createGleeb() {
  const y = Math.floor(Math.random() * (canvas.height - 80));
  gleebs.push({ x: canvas.width, y: y, width: 60, height: 40, speed: 2 });
}

function isColliding(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x &&
         a.y < b.y + b.height && a.y + a.height > b.y;
}

function update() {
  if (gameOver) return;
  if (keys["ArrowUp"] && block.y > 0) block.y -= block.speed;
  if (keys["ArrowDown"] && block.y + block.height < canvas.height) block.y += block.speed;

  for (let i = gleebs.length - 1; i >= 0; i--) {
    const g = gleebs[i];
    g.x -= g.speed;

    if (isColliding(block, g)) {
      gleebs.splice(i, 1);
      killed++;
    } else if (g.x + g.width < 0) {
      gleebs.splice(i, 1);
      missed++;
      if (missed >= 10) endGame("Too many escaped!");
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "gray";
  ctx.fillRect(block.x, block.y, block.width, block.height);

  gleebs.forEach(g => {
    ctx.drawImage(gleebImg, g.x, g.y, g.width, g.height);
  });

  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText("Time: " + timeLeft, 10, 20);
  ctx.fillText("Missed: " + missed, 10, 40);
  ctx.fillText("Killed: " + killed, 10, 60);

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "28px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 90, canvas.height / 2);
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + finalScore, canvas.width / 2 - 40, canvas.height / 2 + 40);
  }
}

function countdown() {
  if (gameOver) return;
  timeLeft--;
  if (timeLeft <= 0) endGame("Time's up!");
}

function endGame(reason) {
  gameOver = true;
  finalScore = missed === 0 ? killed : Math.round(killed / missed);
}

setInterval(createGleeb, 2000);
setInterval(countdown, 1000);
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();


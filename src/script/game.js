const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Adapter la taille du canvas à l'écran
canvas.width = window.innerWidth * 0.75;
canvas.height = window.innerHeight;

const tortues = [];
let saved = 0;
let captured = 0;

const plastique = {
  width: canvas.width * 0.1,
  height: canvas.height * 0.03,
  x: (canvas.width - canvas.width * 0.1) / 2, // Centré horizontalement
  y: canvas.height - canvas.height * 0.05,
  speed: canvas.width * 0.01,
  left: false,
  right: false,
};

const pileWidth = canvas.width * 0.035;
const pileHeight = pileWidth;
const pileGap = pileWidth * 0.2;
let piles = [{ tortues: [] }];

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") plastique.left = true;
  if (e.key === "ArrowRight") plastique.right = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") plastique.left = false;
  if (e.key === "ArrowRight") plastique.right = false;
});

function spawnTortue() {
  tortues.push({
    x: Math.random() * (canvas.width - pileWidth), // Garder les tortues dans les limites
    y: -pileHeight,
    width: pileWidth,
    height: pileHeight,
    speed: canvas.height * 0.004 + Math.random() * canvas.height * 0.002,
  });
}

function collision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function drawPiles() {
  piles.forEach((pile, index) => {
    const baseX = canvas.width + index * (pileWidth + pileGap);
    const baseY = canvas.height - 60;
    pile.tortues.forEach((_, i) => {
      ctx.fillStyle = "green";
      ctx.fillRect(
        baseX,
        baseY - i * (pileHeight + 2),
        pileWidth,
        pileHeight
      );
    });
  });
}

function addToPile(tortue) {
  let lastPile = piles[piles.length - 1];
  const maxHeight = Math.floor(canvas.height / (pileHeight + 2));
  if (lastPile.tortues.length >= maxHeight) {
    piles.push({ tortues: [] });
    lastPile = piles[piles.length - 1];
  }
  lastPile.tortues.push(tortue);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // déplacement
  if (plastique.left && plastique.x > 0) plastique.x -= plastique.speed;
  if (plastique.right && plastique.x + plastique.width < canvas.width)
    plastique.x += plastique.speed;

  // plastique
  ctx.fillStyle = "black";
  ctx.fillRect(plastique.x, plastique.y, plastique.width, plastique.height);

  // tortues
  for (let i = tortues.length - 1; i >= 0; i--) {
    const t = tortues[i];
    t.y += t.speed;

    ctx.fillStyle = "green";
    ctx.fillRect(t.x, t.y, t.width, t.height);

    if (collision(t, plastique)) {
      captured++;
      addToPile(t);
      tortues.splice(i, 1);
    } else if (t.y > canvas.height) {
      saved++;
      tortues.splice(i, 1);
    }
  }

  drawPiles();

  document.getElementById("score").innerText = `Sauvées : ${saved} | Capturées : ${captured}`;

  requestAnimationFrame(update);
}

setInterval(spawnTortue, 700);
update();

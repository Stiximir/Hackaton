const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tortues = [];
let saved = 0;
let captured = 0;
const pile = []; // pour empiler les tortues capturées

const plastique = {
  x: canvas.width / 2 - 30,
  y: canvas.height - 40,
  width: 60,
  height: 20,
  speed: 7,
  left: false,
  right: false
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') plastique.left = true;
  if (e.key === 'ArrowRight') plastique.right = true;
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft') plastique.left = false;
  if (e.key === 'ArrowRight') plastique.right = false;
});

function spawnTortue() {
  tortues.push({
    x: Math.random() * (canvas.width - 20),
    y: -20,
    width: 20,
    height: 20,
    speed: 3 + Math.random() * 2
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

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // déplacer plastique
  if (plastique.left && plastique.x > 0) {
    plastique.x -= plastique.speed;
  }
  if (plastique.right && plastique.x + plastique.width < canvas.width) {
    plastique.x += plastique.speed;
  }

  // plastique
  ctx.fillStyle = 'black';
  ctx.fillRect(plastique.x, plastique.y, plastique.width, plastique.height);

  // pile
  let pileBaseY = canvas.height - 60;
  pile.forEach((tortue, i) => {
    ctx.fillStyle = 'green';
    ctx.fillRect(canvas.width - 30, pileBaseY - i * 22, 20, 20);
  });

  // tortues
  for (let i = tortues.length - 1; i >= 0; i--) {
    const t = tortues[i];
    t.y += t.speed;

    ctx.fillStyle = 'green';
    ctx.fillRect(t.x, t.y, t.width, t.height);

    if (collision(t, plastique)) {
      captured++;
      pile.push(t);
      tortues.splice(i, 1);
    } else if (t.y > canvas.height) {
      saved++;
      tortues.splice(i, 1);
    }
  }

  document.getElementById('score').innerText = `Sauvées : ${saved} | Capturées : ${captured}`;

  requestAnimationFrame(update);
}

setInterval(spawnTortue, 800); // tortues plus fréquentes
update();

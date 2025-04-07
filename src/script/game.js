const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const images = {
  tortue1: new Image(),
  tortue2: new Image(),
  dauphin1: new Image(),
  dauphin2: new Image(),
  deadTortue1: new Image(),
  deadTortue2: new Image(),
  deadDauphin1: new Image(),
  deadDauphin2: new Image(),
  caracter: new Image(),
};

images.caracter.src = "/src/img/caracter.png";
images.tortue1.src = "/src/img/tortue_1_1.png";
images.tortue2.src = "/src/img/tortue_1_2.png";
images.deadTortue1.src = "/src/img/dead_turtle_1_1.png";
images.deadTortue2.src = "/src/img/dead_turtle_1_2.png";
images.dauphin1.src = "/src/img/dauphin_1_1.png";
images.dauphin2.src = "/src/img/dauphin_1_2.png";
images.deadDauphin1.src = "/src/img/dead_dauphin_1_1.png";
images.deadDauphin2.src = "/src/img/dead_dauphin_1_2.png";

// Adapter la taille du canvas à l'écran
canvas.width = window.innerWidth * 0.75;
canvas.height = window.innerHeight;

const tortues = [];
let saved = 0;
let captured = 0;

const plastique = {
  width: canvas.width * 0.1,
  height: canvas.height * 0.12,
  x: (canvas.width - canvas.width * 0.1) / 2, // Centré horizontalement
  y: canvas.height - canvas.height * 0.15, // Remonter la poubelle
  speed: canvas.width * 0.01,
  left: false,
  right: false,
};

const pileWidth = canvas.width * 0.05; // Augmenter la largeur
const pileHeight = pileWidth; // Garder une proportion carrée
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
  var dauphin = false
  var randomImage = Math.random() > 0.5 ? images.tortue1 : images.tortue2;
  if (Math.random() > 0.5) {
    dauphin = true
    randomImage = Math.random() > 0.5 ? images.dauphin1 : images.dauphin2; // Choisir une tortue ou un dauphin aléatoirement
  } // Choisir une image aléatoire
  tortues.push({
    animal: dauphin,
    x: Math.random() * (canvas.width - pileWidth), // Garder les tortues dans les limites
    y: -pileHeight,
    width: pileWidth,
    height: pileHeight,
    speed: canvas.height * 0.004 + Math.random() * canvas.height * 0.002,
    image: randomImage,
    isDead: false, 
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
  piles.forEach((pile) => {
    pile.tortues.forEach((tortue, i) => {
      ctx.drawImage(
        tortue.image, // Utiliser l'image de la tortue
        tortue.x, // Position horizontale
        canvas.height - (i + 1) * (pileHeight + 2), // Empiler les tortues vers le haut
        pileWidth,
        pileHeight
      );
    });
  });
}

function addToPile(tortue) {
  let lastPile = piles[piles.length - 1];
  const maxHeight = Math.floor(canvas.height / (pileHeight + 2)); // Nombre max de tortues par pile

  if (lastPile.tortues.length >= maxHeight) {
    piles.push({ tortues: [] }); // Créer une nouvelle pile
    lastPile = piles[piles.length - 1];
  }

  // Générer une position horizontale aléatoire pour la tortue
  const randomX = Math.random() * (canvas.width - pileWidth); // Position aléatoire sur l'axe X
  const targetY = canvas.height - (lastPile.tortues.length + 1) * (pileHeight + 2); // Position verticale dans la pile

  // Ajouter les propriétés de destination
  tortue.targetX = randomX;
  tortue.targetY = targetY;

  lastPile.tortues.push(tortue);

  const maxPiles = Math.floor(canvas.width / (pileWidth + pileGap));
  if (piles.length > maxPiles) {
    alert("L'écran est saturé de tortues !");
    piles = [{ tortues: [] }]; // Réinitialiser les piles si l'écran est saturé
  }
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Déplacement
  if (plastique.left && plastique.x > 0) plastique.x -= plastique.speed;
  if (plastique.right && plastique.x + plastique.width < canvas.width)
    plastique.x += plastique.speed;

  // Dessiner l'image de la barre (plastique)
  ctx.drawImage(images.caracter, plastique.x, plastique.y, plastique.width, plastique.height);

  // Tortues
  for (let i = tortues.length - 1; i >= 0; i--) {
    const t = tortues[i];
    t.y += t.speed;

    // Vérifier si la tortue est morte
    if (t.isDead) {
      // Dessiner l'image de la tortue morte
      ctx.drawImage(t.image, t.x, t.y, t.width, t.height);
      continue; // Passer à la prochaine tortue
    }

    // Dessiner l'image de la tortue vivante
    ctx.drawImage(t.image, t.x, t.y, t.width, t.height);

    if (collision(t, plastique)) {
      captured++;
      if (t.animal) {
        t.image = Math.random() > 0.5 ? images.deadDauphin1 : images.deadDauphin2;
      } else if (!t.dauphin) {
        t.image = Math.random() > 0.5 ? images.deadTortue1 : images.deadTortue2;
      }
      addToPile(t);
      tortues.splice(i, 1); // Retirer la tortue capturée
    } else if (t.y > canvas.height) {
      // Marquer la tortue comme morte et remplacer son image
      t.isDead = true;

      // Positionner la tortue morte juste au bord inférieur
      t.y = canvas.height - t.height;

      // Incrémenter le compteur "sauvées"
      saved++;
    }
  }

  // Animer les tortues capturées vers leur position cible
  piles.forEach((pile) => {
    pile.tortues.forEach((tortue) => {
      // Déplacement progressif vers la position cible
      tortue.x += (tortue.targetX - tortue.x) * 0.1; // Animation fluide sur l'axe X
      tortue.y += (tortue.targetY - tortue.y) * 0.1; // Animation fluide sur l'axe Y

      // Dessiner l'image de la tortue capturée
      ctx.drawImage(tortue.image, tortue.x, tortue.y, pileWidth, pileHeight);
    });
  });

  drawPiles();

  document.getElementById("score").innerText = `Echappée.s : ${saved}\n Morte.s : ${captured}`;

  requestAnimationFrame(update);
}

setInterval(spawnTortue, 700);
update();
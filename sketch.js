var bg;
var bgMusic = [];
var pSprites = [];
var mapRawData;
var weaponProperties = [];
var weaponSprites = [];
var bulletSprites = [];
var enemySprites = [];
var enemyNum = 4;
var jacketSprite;
var weaponNum = 12;
var mapData = [];
var mapBlocks = [];
var surfaceBlocks = [];
var blockImg;
var blockWidth = 30;
var a = 0,
  d = 0,
  w = 0,
  s = 0,
  space = 0,
  up = 0,
  down = 0,
  left = 0,
  right = 0;
var player;
var enemies = [];
var maxEnemies = 10;
var spawnTimer = 0;
var bullets = [];
var frameCount = 0;
var score = 0;
var inMenus = false;
var menuFont;

var crate;

function preload() {
  mapRawData = loadStrings("maps/map0.txt");

  for (var i = 0; i < weaponNum; i++) {
    weaponProperties.push(loadStrings("weapons/weapon" + i + ".txt"));
    weaponSprites.push(loadImage("res/weapons/weapon" + i + ".png"));
  }

  for (var i = 0; i < enemyNum; i++) {
    enemySprites.push(loadImage("res/enemies/" + i + ".png"));
  }

  bulletSprites.push(loadImage("res/bullets/bullet.png"));
  bulletSprites.push(loadImage("res/bullets/bed.png"));
  bulletSprites.push(loadImage("res/bullets/money.png"));
  bulletSprites.push(loadImage("res/bullets/dodgeball.png"));
  bulletSprites.push(loadImage("res/bullets/chrome.png"));
  bulletSprites.push(loadImage("res/bullets/instagram.png"));

  jacketSprite = loadImage("res/jacket.png");

  blockImg = loadImage("res/block.png");
  bg = loadImage("res/background.jpg");

  menuFont = loadFont("res/SaucerBB.ttf");
}

function setup() {
  createCanvas(1080, 900);

  //textFont(menuFont);
  textAlign(CENTER, TOP);

  for (var i = 0; i < bulletSprites.length; i++) {
    bulletSprites[i].resize(blockWidth, blockWidth);
  }

  initKeys();
  parseMap();
  setupBlocks();
  initSurfaceBlocks();
  player = new Player(200, 200);

  crate = new Crate();
}

function draw() {
  if (inMenus) {
    menuFrame();
  } else {
    gameFrame();
    if (player.dead) {
      inMenus = true;
    }
  }

  frameCount++;
}

function menuFrame() {
  checkBgSize();
  score = 0;

  background(255);
  image(bg, 0, 0);

  fill(0);
  stroke(255);
  strokeWeight(3);
  text("FROSHHHHH", width / 2, height / 2);
}

function gameFrame() {
  checkBgSize();

  background(255);
  //tint(255, 127);
  image(bg, 0, 0);

  renderMap();
  if (!player.dead) {
    player.update();
    player.render();
  }
  crate.render();

  for (var i = enemies.length - 1; i >= 0; i--) {
    if (enemies[i].dead()) {
      enemies.splice(i, 1);
    } else {
      enemies[i].update();
      enemies[i].render();
    }
  }
  addEnemies();

  for (var i = bullets.length - 1; i >= 0; i--) {
    if (bullets[i].toDelete) {
      bullets.splice(i, 1);
    } else {
      bullets[i].update();
      bullets[i].render();
    }
  }

  //Score Manager
  textSize(32);
  fill(255);
  stroke(0);
  strokeWeight(5);
  text(score, this.width / 2, blockWidth * 3);
}

function renderMap() {
  for (var i = 0; i < mapBlocks.length; i++) { //draw all maps on screen
    for (var j = 0; j < mapBlocks[i].length; j++) {
      if (mapBlocks[i][j].type != 0)
        mapBlocks[i][j].render();
    }
  }
}

function addEnemies() {
  if (enemies.length < maxEnemies && millis() - spawnTimer >= 2000) {
    enemies.push(new Enemy((floor(width/blockWidth)/2 + floor(random(2)) - 1) * blockWidth, blockWidth));
    spawnTimer = millis();
  }
}

function parseMap() {
  for (var i = 0; i < mapRawData.length; i++) { //parsing raw map data to make it usable
    mapData.push(split(mapRawData[i], " "));
  }
}

function setupBlocks() {
  for (var i = 0; i < mapData.length; i++) { //setting up the block objects for the map
    var a = [];
    for (var j = 0; j < mapData[i].length; j++) {
      var b = new Block(j * blockWidth, i * blockWidth, blockWidth, blockWidth,
        parseInt(mapData[i][j]));
      if (mapData[i][j] == 2) {
        b.setColour(71, 60, 139);
      } else if (mapData[i][j] == 0) {
        b.setColour(255, 255, 255);
      }

      a.push(b);
    }
    mapBlocks.push(a);
  }
}

function initSurfaceBlocks() {
  for (var i = 0; i < (width / blockWidth); i++) {
    for (var j = 8; j < (height / blockWidth); j++) {
      if (mapBlocks[j][i].type != 0 && mapBlocks[j-1][i].type == 0) {
        surfaceBlocks.push(mapBlocks[j][i]);
      }
    }
  }
}

function initKeys() {}

function keyPressed() {
  switch (key) {
    case 'A':
      a = 1;
      break;
    case 'D':
      d = 1;
      break;
    case 'W':
      w = 1;
      break;
    case 'S':
      s = 1;
      break;
    case ' ':
      space = 1;
      break;
    default:
      break;
  }

  switch (keyCode) {
    case UP_ARROW:
      up = 1;
      break;
    case DOWN_ARROW:
      down = 1;
      break;
    case LEFT_ARROW:
      left = 1;
      break;
    case RIGHT_ARROW:
      right = 1;
      break;
    default:
      break;
  }
}

function keyReleased() {
  switch (key) {
    case 'A':
      a = 0;
      break;
    case 'D':
      d = 0;
      break;
    case 'W':
      w = 0;
      break;
    case 'S':
      s = 0;
      break;
    case ' ':
      space = 0;
      break;
    default:
      break;
  }

  switch (keyCode) {
    case UP_ARROW:
      up = 0;
      break;
    case DOWN_ARROW:
      down = 0;
      break;
    case LEFT_ARROW:
      left = 0;
      break;
    case RIGHT_ARROW:
      right = 0;
      break;
    default:
      break;
  }
}

function checkBgSize() {
  if (bg.width != width) {
    bg.resize(width, height);
  }
}

function toGrid(x, y) {
  return createVector(floor(x / blockWidth), floor(y / blockWidth));
}

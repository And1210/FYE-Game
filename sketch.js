var pSprite;
var mapRawData;
var mapData = [];
var mapBlocks = [];
var blockWidth = 25;
var a = 0,
  d = 0,
  w = 0,
  s = 0,
  space = 0;
var player;
var enemies = [];
var maxEnemies = 10;
var spawnTimer = 0;
var bullets = [];
var frameCount = 0;

function preload() {
  mapRawData = loadStrings("maps/map0.txt");

  //pSprite = loadImage("insert path here");
}

function setup() {
  createCanvas(750, 750);

  initKeys();
  parseMap();
  blockWidth = width / mapData.length;
  setupBlocks();
  player = new Player(200, 200);
}

function draw() {
  background(255);

  renderMap();
  player.update();
  player.render();

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

  frameCount++;
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
  if (enemies.length < maxEnemies && millis() - spawnTimer >= 1000) {
    enemies.push(new Enemy((14 + floor(random(2))) * blockWidth, blockWidth));
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
        mapData[i][j]);
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
      player.shootTimer = 0;
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
}

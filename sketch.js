var descriptions = [
  "Dis ya boi the president here.\nNathan's the name, flexing on y'all's the game.\nMy gun may be weak but my rhymes are strong.\nI'm just like a carrot: orange, dirty, and long ;)",
  "Hey folks! Name's Mike Pen- ANDREW VASILA.\nDefinetly not Mike Pence, nope, I swear.\nMy hobbies include: Christmas, Christmas, and Christmas.\nLink me on tinder, bumble, grindr.... y'know, whatever!",
  "Second Andrew of the exec here, usually known as Farley.\nI'm your AMS rep, definitely been to all of those meetings.....\nSome might say I'm INVISIBLE during them.\nI don't really know what my guy does, you mind figuring it out?",
  "Feeling down? Maybe dissatisfied?\nYes, I am talking sexually, what else would I be talking about?\nDon't you worry! The BED Fun(d) rep is here.\nName's Matt Julseth and I'll EXPLODE all over your problems.",
  "Hey, I'm Tess and I'm Thomas!\nWe've been desiging that blessed bling y'all have ordered.\nCool kids invest in the latest fashion.How will you feel\nwhen all you friends are repping that Sci 21' crest and you ain't?",
  "Monique and Mitch here planning some sick events for our year.\nYa, we swear we're doing stuff...\nThere are things coming for next semester...\nIt was a rough start ok.",
  "How did I get charged with managing the money?\nWell I guess we're all on this rollercoaster ride to see.\nMy name is Olivia and I'm the treasurer.\nBuy year merch.",
  "WHO'S READY FOR BEWIC!!! Oh, you don't know what that is??\n(Lowkey, we aren't really sure either, like honestly\nwhat could that stand for. Boi Eh We In Campus???)\nLaurel and Liam here, we da athELITES of dis group.",
  "Hey everyone, Graeme and Alex here.\nApparently we broke the matching first letter streak.\nWe're the Sci Formal reps which means we sit back and...\nWell, we don't do much, but we want to, but sitting's nice.",
  "I want you to look up to the top of this website.\nThere? Awesome, ya we made this beautiful specimen.\nOur names are Laura and Kiki.\nWe're the webmaster wizards of Sci 21' Exec.",
  "Hey y'all! Wanna know how to start a bomb insta?\nYa, so just get other people to send you memes.\nThen post these memes and get popular off others' work, so simple!\nI'm Kelsey and I'm the FYE scribe/social media person.",
  "The c-men of year exec here! Chas, Claire, and Christina.\nNot only do our names begin with 'c' but so do our skills.\nCalves, can't-seem-to-show-up, and confused easily describe us perfectly.\nWe are your section reps and if you ever see us\njust yell 'HEY, THAT'S SOME OF MY C-MEN!'"
];

var bg;
var bgMusic = [];
var pSprites = [];
var mapRawData;
var weaponProperties = [];
var weaponSprites = [];
var weaponIcons = [];
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
var spawnRate = 2000;
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
var maxEnemies = 15;
var spawnTimer = 0;
var bullets = [];
var frameCount = 0;
var score = 0;
var inMenus = true;
var meet = false;
var help = false;
var menuFont;
var curMeet = 0;
var released = true;

var crate;

function preload() {
  mapRawData = loadStrings("maps/map0.txt");

  for (var i = 0; i < weaponNum; i++) {
    weaponProperties.push(loadStrings("weapons/weapon" + i + ".txt"));
    weaponSprites.push(loadImage("res/weapons/weapon" + i + ".png"));
    weaponIcons.push(loadImage("res/weapons/weapon" + i + ".png"));
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
  createCanvas(blockWidth * 36, blockWidth * 30);

  //textFont(menuFont);
  textAlign(CENTER, TOP);

  for (var i = 0; i < bulletSprites.length; i++) {
    bulletSprites[i].resize(blockWidth, blockWidth);
  }

  for (var i = 0; i < weaponSprites.length; i++) {
    weaponIcons[i].resize(0, height / 3);
  }

  initKeys();
  parseMap();
  setupBlocks();
  initSurfaceBlocks();
  player = new Player(width / 2, height / 2);

  crate = new Crate();
}

function draw() {
  if (inMenus) {
    menuFrame();
  } else if (meet) {
    meetFrame();
  } else if (help) {
    helpFrame();
  } else {
    gameFrame();
    if (player.dead) {
      inMenus = true;
      enemies = [];
      bullets = [];
      player = new Player(width / 2, height / 2);
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
  textSize(64*width/1080);
  text("FROSHHHHH", width / 2, height / 4);
  textSize(32);
  text("Play", width / 2, height / 2.25);
  if (mouseY > height / 2.25 && mouseY < height / 2.25 + 64*width/1080) {
    if (mouseIsPressed) {
      inMenus = false;
    }
  }
  text("Meet the Exec", width / 2, height / 1.85);
  if (mouseY > height / 1.85 && mouseY < height / 1.85 + 64*width/1080) {
    if (mouseIsPressed) {
      inMenus = false;
      meet = true;
    }
  }
  text("Help", width / 2, height / 1.60);
  if (mouseY > height / 1.60 && mouseY < height / 1.60 + 64*width/1080) {
    if (mouseIsPressed) {
      inMenus = false;
      help = true;
    }
  }
}

function helpFrame() {
  checkBgSize();

  background(255);
  imageMode(CORNER);
  image(bg, 0, 0);

  var data = "How to Play:\n\nUse the arrow keys or WASD to move around\nand space to shoot! The goal of the game\nis to collect as many GPAs as you can.\nEverytime you get one it will give you a new\nYear Exec Member. Don't let the enemies reach the\nbottom or their spawn rate will increase.";
  textAlign(CENTER, CENTER);
  text(data, width / 2, height / 2);

  textAlign(LEFT, TOP);
  text("Back", 20, 20);
  if (mouseY < 60 && mouseIsPressed) {
    meet = false;
    inMenus = true;
    imageMode(CORNER);
    textAlign(CENTER, TOP);
  }
}

function meetFrame() {
  checkBgSize();

  background(255);
  imageMode(CORNER);
  image(bg, 0, 0);

  imageMode(CENTER, TOP);
  image(weaponIcons[curMeet], width / 2, height / 3);

  textAlign(LEFT, LEFT);
  textSize(40*width/1080);
  text("Back", 20, 20);
  if (mouseY < 60 && mouseIsPressed) {
    meet = false;
    inMenus = true;
    imageMode(CORNER);
    textAlign(CENTER, TOP);
  }

  if (released) {
    if (mouseX > 2 * width / 3 && mouseIsPressed) {
      curMeet++;
      curMeet %= 12;
      released = false;
    } else if (mouseX < width / 3 && mouseIsPressed) {
      curMeet--;
      if (curMeet < 0)
        curMeet = 11;
      released = false;
    }
  }

  textSize(32);
  textAlign(CENTER, TOP);
  text(descriptions[curMeet], width / 2, 1.75 * height / 3);

  beginShape();
  vertex(5 * width / 6, height / 2 - 20);
  vertex(5.5 * width / 6, height / 2 - 20);
  vertex(5.5 * width / 6, height / 2 - 40);
  vertex(5.75 * width / 6, height / 2);
  vertex(5.5 * width / 6, height / 2 + 40);
  vertex(5.5 * width / 6, height / 2 + 20);
  vertex(5 * width / 6, height / 2 + 20);
  endShape();

  beginShape();
  vertex(1 * width / 6, height / 2 - 20);
  vertex(0.5 * width / 6, height / 2 - 20);
  vertex(0.5 * width / 6, height / 2 - 40);
  vertex(0.25 * width / 6, height / 2);
  vertex(0.5 * width / 6, height / 2 + 40);
  vertex(0.5 * width / 6, height / 2 + 20);
  vertex(1 * width / 6, height / 2 + 20);
  endShape();
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
  textAlign(CENTER, CENTER);
  text(score, this.width / 2, blockWidth * 3);
  textAlign(CENTER, TOP);
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
  if (enemies.length < maxEnemies && millis() - spawnTimer >= spawnRate) {
    enemies.push(new Enemy((floor(width / blockWidth) / 2 + floor(random(2)) -
      1) * blockWidth, blockWidth));
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
      if (mapBlocks[j][i].type != 0 && mapBlocks[j - 1][i].type == 0) {
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

function mouseReleased() {
  released = true;
}

function checkBgSize() {
  if (bg.width != width) {
    bg.resize(width, height);
  }
}

function toGrid(x, y) {
  return createVector(floor(x / blockWidth), floor(y / blockWidth));
}

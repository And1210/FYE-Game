function Player(x, y) {
  this.pos = createVector(x, y);
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.gridPos = createVector(floor(x / blockWidth), floor(y / blockWidth));
  this.sprite; //need to load image
  this.speed = 17;
  this.dir = 0;
  this.dead = false;
  this.inContact = [false, false, false, false]; //left, right, top, bottom
  this.shootTimer = 0;
  this.shootRate = 35;
}

Player.prototype.update = function() {
  //this.checkEnemyCollision();
  this.checkContact();
  this.checkInput();
  this.kinematics();
  this.gravity();
  this.shoot();
}

Player.prototype.render = function() {
  noStroke();
  fill(0);
  if (!this.dead)
    rect(this.pos.x, this.pos.y, blockWidth, blockWidth * 2);
}

Player.prototype.gravity = function() {
  if (!this.inContact[3]) {
    this.applyForce(0, 1);
  }
}

Player.prototype.checkEnemyCollision = function() {
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].collision(this.pos, blockWidth, 2 * blockWidth)) {
      this.dead = true;
    }
  }
}

Player.prototype.checkContact = function() {
  this.gridPos.set(floor(this.pos.x / blockWidth), floor(this.pos.y /
    blockWidth));

  if (mapBlocks[this.gridPos.y + 2][this.gridPos.x].type != 0 ||
    mapBlocks[this.gridPos.y + 2][this.gridPos.x + 1].type != 0 &&
    mapBlocks[this.gridPos.y][this.gridPos.x + 1].type == 0) {
    this.inContact[3] = true;
  } else {
    this.inContact[3] = false;
  }

  if (mapBlocks[this.gridPos.y - 1][this.gridPos.x].type != 0 ||
    mapBlocks[this.gridPos.y - 1][this.gridPos.x + 1].type != 0 &&
    mapBlocks[this.gridPos.y][this.gridPos.x + 1].type == 0) {
    this.inContact[2] = true;
  } else {
    this.inContact[2] = false;
  }

  if (mapBlocks[this.gridPos.y][this.gridPos.x + 1].type != 0 ||
    mapBlocks[this.gridPos.y + 1][this.gridPos.x + 1].type != 0) {
    this.inContact[1] = true;
  } else {
    this.inContact[1] = false;
  }

  if (mapBlocks[this.gridPos.y][this.gridPos.x - 1].type != 0 ||
    mapBlocks[this.gridPos.y + 1][this.gridPos.x - 1].type != 0) {
    this.inContact[0] = true;
  } else {
    this.inContact[0] = false;
  }

  if (this.inContact[3] && this.vel.y > 0) {
    this.vel.set(this.vel.x, 0);
    this.pos.set(this.pos.x, this.gridPos.y * blockWidth);
  }
  if (this.inContact[2] && this.vel.y < 0) {
    this.vel.set(this.vel.x, 0);
    this.pos.set(this.pos.x, this.gridPos.y * blockWidth + 1);
  }
  if (this.inContact[1] && this.vel.x > 0) {
    this.vel.set(0, this.vel.y);
    this.pos.set(this.gridPos.x * blockWidth, this.pos.y);
  }
  if (this.inContact[0] && this.vel.x < 0) {
    this.vel.set(0, this.vel.y);
    this.pos.set(this.gridPos.x * blockWidth, this.pos.y);
  }
}

Player.prototype.shoot = function() {
  if (space == 1 && frameCount - this.shootTimer >= this.shootRate) {
    this.shootTimer = frameCount;
    // bullets.push(new Bullet(this.pos.x, this.pos.y, this.dir));
    bullets.push(new Bullet(this.pos.x + blockWidth * (this.dir / 2.0 + 0.5),
      this.pos.y + blockWidth, this.dir));
  }
}

Player.prototype.kinematics = function() {
  this.applyForce(-this.vel.x * 0.99, 0);

  this.vel.add(this.acc);
  this.pos.add(this.vel);
  this.acc.mult(0);
}

Player.prototype.applyForce = function(x, y) {
  this.acc.add(x, y);
}

Player.prototype.checkInput = function() {
  if (a == 1 && !this.inContact[0]) {
    this.applyForce(-this.speed / 2, 0);
    this.dir = -1;
  }
  if (d == 1 && !this.inContact[1]) {
    this.applyForce(this.speed / 2, 0);
    this.dir = 1;
  }
  if (w == 1 && this.inContact[3] == true) {
    this.applyForce(0, -this.speed);
  }
  if (s == 1) {
    //this.applyForce(0, this.speed);
  }
}
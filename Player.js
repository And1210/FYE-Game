function Player(x, y) {
  this.pos = createVector(x, y);
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.gridPos = createVector(floor(x / blockWidth), floor(y / blockWidth));
  this.speed = 15;
  this.dir = 1;
  this.dead = false;
  this.inContact = [false, false, false, false]; //left, right, top, bottom
  this.shootTimer = 0;
  this.shootRate = 35;

  this.type = 0;
  this.weapon = new Weapon(this.type);
  this.sprite = weaponSprites[this.type];
  this.sprite.resize(this.weapon.width, this.weapon.height);
}

Player.prototype.update = function() {
  // this.checkEnemyCollision();
  this.checkCrateCollision();
  this.checkContact();
  this.checkInput();
  this.kinematics();
  this.gravity();
  this.shoot();
  this.checkOutBounds();
}

Player.prototype.render = function() {
  noStroke();
  fill(0);
  if (!this.dead) {
    // rect(this.pos.x, this.pos.y, blockWidth, blockWidth * 2);
    push();
    imageMode(CENTER);
    translate(this.pos.x + this.sprite.width / 2, this.pos.y + this.sprite.height /
      2);
    scale(this.dir, 1);
    image(this.sprite, 0, 0);
    imageMode(CORNER);
    pop();
  }
}

Player.prototype.gravity = function() {
  if (!this.inContact[3]) {
    this.applyForce(0, 0.75);
  }
}

Player.prototype.checkEnemyCollision = function() {
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].collision(this.pos, blockWidth, 2 * blockWidth)) {
      this.dead = true;
    }
  }
}

Player.prototype.checkCrateCollision = function() {
  if (crate.collision(this.pos, blockWidth, 2 * blockWidth)) {
    crate.spawn();
    this.switchWeapon(floor(random(weaponNum)));
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

Player.prototype.checkOutBounds = function() {
  this.gridPos.set(floor(this.pos.x / blockWidth), floor(this.pos.y /
    blockWidth));

  if (this.gridPos.x < 1 || this.gridPos.x > floor(width/blockWidth) - 2 || this.gridPos.y > floor(height/blockWidth) - 3) {
    this.dead = true;
  }
}

Player.prototype.shoot = function() {
  this.shootRate = this.weapon.fireRate;
  if (space == 1 && frameCount - this.shootTimer >= this.shootRate) {
    this.shootTimer = frameCount;
    // bullets.push(new Bullet(this.pos.x, this.pos.y, this.dir));
    if (this.weapon.num_bullets == 5) {
      for (var i = 0; i <= PI; i += PI / 4) {
        bullets.push(new Bullet(this.pos.x,
          this.pos.y + blockWidth, this.dir, this.weapon.damage, this.weapon
          .speed * Math.cos(i), -20 * Math.sin(i), this.weapon.type));
      }
    } else if (this.weapon.num_bullets == 2) {
      bullets.push(new Bullet(this.pos.x,
        this.pos.y + blockWidth, this.dir, this.weapon.damage, this.weapon
        .speed, 0, this.weapon.type));
      bullets.push(new Bullet(this.pos.x,
        this.pos.y + blockWidth, -this.dir, this.weapon.damage, this.weapon
        .speed, 0, this.weapon.type));
    } else {
      for (var i = 0; i < this.weapon.num_bullets; i++) {
        bullets.push(new Bullet(this.pos.x,
          this.pos.y + blockWidth, this.dir, this.weapon.damage, this.weapon
          .speed, random(i * 2) - i, this.weapon.type));
      }
    }
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

Player.prototype.switchWeapon = function(type) {
  this.type = type;
  this.weapon = new Weapon(this.type);
  this.sprite = weaponSprites[this.type];
  this.sprite.resize(this.weapon.width, this.weapon.height);
}

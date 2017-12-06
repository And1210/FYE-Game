function Player(x, y) {
  this.pos = createVector(x, y);
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.prevAcc = createVector(0, 0);
  this.gridPos = createVector(floor(x / blockWidth), floor(y / blockWidth));
  this.speed = 17;
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
  this.applyForce(0, 0.75);
}

Player.prototype.checkEnemyCollision = function() {
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].collision(this.pos, blockWidth, 2 * blockWidth)) {
      this.dead = true;
    }
  }
}

Player.prototype.checkCrateCollision = function() {
  if (crate.collision(this.pos, this.weapon.width, this.weapon.height)) {
    crate.spawn();
    score++;
    this.switchWeapon(floor(random(weaponNum)));
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
          this.pos.y + 20, this.dir, this.weapon.damage, this.weapon
          .speed * Math.cos(i), -20 * Math.sin(i), this.weapon.type));
      }
    } else if (this.weapon.num_bullets == 2) {
      bullets.push(new Bullet(this.pos.x,
        this.pos.y + 20, this.dir, this.weapon.damage, this.weapon
        .speed, 0, this.weapon.type));
      bullets.push(new Bullet(this.pos.x,
        this.pos.y + 20, -this.dir, this.weapon.damage, this.weapon
        .speed, 0, this.weapon.type));
    } else {
      for (var i = 0; i < this.weapon.num_bullets; i++) {
        bullets.push(new Bullet(this.pos.x,
          this.pos.y + 20, this.dir, this.weapon.damage, this.weapon
          .speed, random(i * 2) - i, this.weapon.type));
      }
    }
  }
}

Player.prototype.kinematics = function() {
  this.applyForce(-this.vel.x * 0.99, 0);

  this.pos.add(this.vel);
  this.vel.add(this.acc);
  this.prevAcc.set(this.acc.x, this.acc.y);
  this.acc.mult(0);
}

Player.prototype.applyForce = function(x, y) {
  this.acc.add(x, y);
}

Player.prototype.checkInput = function() {
  if (a == 1) {
    this.applyForce(-this.speed / 2, 0);
    this.dir = -1;
  }
  if (d == 1) {
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

Player.prototype.checkContact = function() {
  this.gridPos.set(floor(this.pos.x / blockWidth), floor(this.pos.y /
    blockWidth));
  var xT = this.pos.x + this.vel.x;
  var yT = this.pos.y + this.vel.y;
  var rPosU = toGrid(xT + this.weapon.width, yT);
  var rPosD = toGrid(xT + this.weapon.width, yT + this.weapon.height);
  var lPosU = toGrid(xT, yT);
  var lPosD = toGrid(xT, yT + this.weapon.height);

  //Checking bottom
  if (mapBlocks[lPosD.y][lPosD.x].type != 0 || mapBlocks[rPosD.y][rPosD.x].type != 0) {
    this.inContact[3] = true;
    this.vel.set(this.vel.x, 0);
  } else {
    this.inContact[3] = false;
  }

  xT = this.pos.x + this.vel.x;
  yT = this.pos.y + this.vel.y;
  rPosU = toGrid(xT + this.weapon.width, yT);
  rPosD = toGrid(xT + this.weapon.width, yT + this.weapon.height);
  lPosU = toGrid(xT, yT);
  lPosD = toGrid(xT, yT + this.weapon.height);

  //Checking top
  if (mapBlocks[lPosU.y][lPosU.x].type != 0 || mapBlocks[rPosU.y][rPosU.x].type != 0) {
    this.inContact[2] = true;
    this.vel.set(this.vel.x, 0);
  } else {
    this.inContact[2] = false;
  }

  xT = this.pos.x + this.vel.x * 2;
  yT = this.pos.y + this.vel.y;
  rPosU = toGrid(xT + this.weapon.width, yT);
  rPosD = toGrid(xT + this.weapon.width, yT + this.weapon.height);
  lPosU = toGrid(xT, yT);
  lPosD = toGrid(xT, yT + this.weapon.height);

  //Checking right
  if (mapBlocks[rPosU.y][rPosU.x].type != 0 || mapBlocks[rPosD.y][rPosD.x].type != 0
    || mapBlocks[floor((rPosU.y+rPosD.y)/2)][rPosU.x].type != 0) {
    this.inContact[1] = true;
    this.vel.set(0, this.vel.y);
  } else {
    this.inContact[1] = false;
  }

  xT = this.pos.x + this.vel.x * 2;
  yT = this.pos.y + this.vel.y;
  rPosU = toGrid(xT + this.weapon.width, yT);
  rPosD = toGrid(xT + this.weapon.width, yT + this.weapon.height);
  lPosU = toGrid(xT, yT);
  lPosD = toGrid(xT, yT + this.weapon.height);

  //Checking left
  if (mapBlocks[lPosU.y][lPosU.x].type != 0 || mapBlocks[lPosD.y][lPosD.x].type != 0
    || mapBlocks[floor((lPosU.y+lPosD.y)/2)][lPosU.x].type != 0) {
    this.inContact[0] = true;
    this.vel.set(0, this.vel.y);
  } else {
    this.inContact[0] = false;
  }

  // console.log(this.inContact);
}

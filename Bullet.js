function Bullet(x, y, dir, dmg, vX, vY, type) {
  this.pos = createVector(x, y);
  this.speed = 20;
  this.vel = createVector(this.speed * dir * vX, vY);
  this.dmg = dmg;
  this.width = blockWidth / 2;
  this.height = blockWidth / 2;
  this.type = type;

  this.toDelete = false;
  this.explode = false;
  this.explodeTime = 0;
}

Bullet.prototype.update = function() {
  this.pos.add(this.vel);

  this.checkBounds();
  this.enemyHit();
}

Bullet.prototype.render = function() {
  // noStroke();
  // fill(0, 0, 255);
  // //rect(this.pos.x, this.pos.y, this.width, this.height);
  // ellipse(this.pos.x + this.width/2, this.pos.y + this.height/2, this.width, this.height);
  if (!this.explode) {
    switch (this.type) {
      case 0, 1, 2, 4, 5, 8, 11:
        image(bulletSprites[0], this.pos.x, this.pos.y);
        break;
      case 3:
        image(bulletSprites[1], this.pos.x, this.pos.y);
        break;
      case 6:
        image(bulletSprites[2], this.pos.x, this.pos.y);
        break;
      case 7:
        image(bulletSprites[3], this.pos.x, this.pos.y);
        break;
      case 9:
        image(bulletSprites[4], this.pos.x, this.pos.y);
        break;
      case 10:
        image(bulletSprites[5], this.pos.x, this.pos.y);
        break;
      default:
        image(bulletSprites[0], this.pos.x, this.pos.y);
    }
  } else {
    stroke(255, 0, 0);
    fill(0);
    var timeDone = frameCount - this.explodeTime;
    ellipse(this.pos.x, this.pos.y, (timeDone / 10.0) * (width / 3), (
      timeDone / 10.0) * (width / 3));
    if (timeDone > 10) {
      this.toDelete = true;
    }
    for (var i = 0; i < enemies.length; i++) {
      if (p5.Vector.sub(p5.Vector.add(enemies[i].pos, createVector(
          blockWidth / 2, blockWidth / 2)), this.pos.copy()).mag() <= (
          timeDone / 10.0) * (width / 3)) {
        enemies[i].damage(this.dmg);
      }
    }
  }
}

Bullet.prototype.checkBounds = function() {
  if (this.pos.x <= 0 || this.pos.x >= width || this.pos.y <= 0 || this.pos.y >=
    height) {
      if (this.type != 7) {
        this.toDelete = true;
      } else {
        this.pos = createVector(width - this.pos.x, this.pos.y);
      }
  }
}

Bullet.prototype.enemyHit = function() {
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].collision(this.pos, this.width, this.height)) {
      enemies[i].damage(this.dmg);
      this.destroy();
    }
  }
}

Bullet.prototype.destroy = function() {
  if (this.type == 3 || this.type == 10) {
    this.explode = true;
    this.vel = createVector(0, 0);
    this.explodeTime = frameCount;
  } else if (this.type != 9){
    this.toDelete = true;
  }
}

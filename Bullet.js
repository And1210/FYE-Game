function Bullet(x, y, dir, dmg) {
  this.pos = createVector(x, y);
  this.speed = 20;
  this.vel = createVector(this.speed * dir, 0);
  this.toDelete = false;
  this.dmg = dmg;
  this.width = blockWidth;
  this.height = blockWidth / 2;
}

Bullet.prototype.update = function() {
  this.pos.add(this.vel);

  this.checkBounds();
  this.enemyHit();
}

Bullet.prototype.render = function() {
  noStroke();
  fill(0, 255, 120);
  rect(this.pos.x, this.pos.y, this.width, this.height);
}

Bullet.prototype.checkBounds = function() {
  if (this.pos.x <= 0 || this.pos.x >= width || this.pos.y <= 0 || this.pos.y >= height) {
    this.toDelete = true;
  }
}

Bullet.prototype.enemyHit = function() {
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].collision(this.pos, this.width, this.height)) {
      enemies[i].damage(this.dmg);
      this.toDelete = true;
    }
  }
}

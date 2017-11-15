function Bullet(x, y, dir, dmg, vX, vY, type) {
  this.pos = createVector(x, y);
  this.speed = 20;
  this.vel = createVector(this.speed * dir * vX, vY);
  this.toDelete = false;
  this.dmg = dmg;
  this.width = blockWidth / 2;
  this.height = blockWidth / 2;
}

Bullet.prototype.update = function() {
  this.pos.add(this.vel);

  this.checkBounds();
  this.enemyHit();
}

Bullet.prototype.render = function() {
  noStroke();
  fill(0, 0, 255);
  //rect(this.pos.x, this.pos.y, this.width, this.height);
  ellipse(this.pos.x + this.width/2, this.pos.y + this.height/2, this.width, this.height);
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

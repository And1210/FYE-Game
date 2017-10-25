function Bullet(x, y, dir) {
  this.pos = createVector(x, y);
  this.speed = 15;
  this.vel = createVector(this.speed * dir, 0);
  this.toDelete = false;
}

Bullet.prototype.update = function() {
  this.pos.add(this.vel);

  this.checkBounds();
}

Bullet.prototype.render = function() {
  noStroke();
  fill(0, 255, 120);
  rect(this.pos.x, this.pos.y, blockWidth / 2, blockWidth / 2);
}

Bullet.prototype.checkBounds = function() {
  if (this.pos.x <= 0 || this.pos.x >= width || this.pos.y <= 0 || this.pos.y >= height) {
    this.toDelete = true;
  }
}

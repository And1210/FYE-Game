function Enemy(x, y) {
  this.pos = createVector(x, y);
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.gridPos = createVector(floor(x / blockWidth), floor(y / blockWidth));
  this.sprite; //need to load image
  this.speed = 2;
  this.inContact = [false, false, false, false]; //left, right, top, bottom

  this.dir;
  if (random() >= 0.5) {
    this.dir = 1;
  } else {
    this.dir = -1;
  }
}

Enemy.prototype.update = function() {
  this.checkContact();
  this.move();
  this.kinematics();
  this.gravity();
}

Enemy.prototype.render = function() {
  noStroke();
  fill(127);
  rect(this.pos.x, this.pos.y, blockWidth, blockWidth);
}

Enemy.prototype.gravity = function() {
  if (!this.inContact[3]) {
    this.applyForce(0, 1);
  }
}

Enemy.prototype.checkContact = function() {
  this.gridPos.set(floor(this.pos.x / blockWidth), floor(this.pos.y /
    blockWidth));

  if (mapBlocks[this.gridPos.y + 1][this.gridPos.x].type != 0 ||
    mapBlocks[this.gridPos.y + 1][this.gridPos.x + 1].type != 0 &&
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

  if (mapBlocks[this.gridPos.y][this.gridPos.x + 1].type != 0) {
    this.inContact[1] = true;
  } else {
    this.inContact[1] = false;
  }

  if (mapBlocks[this.gridPos.y][this.gridPos.x].type != 0) {
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
    this.pos.set((this.gridPos.x + 1) * blockWidth, this.pos.y);
  }
}

Enemy.prototype.kinematics = function() {
  this.applyForce(-this.vel.x * 0.99, 0);

  this.vel.add(this.acc);
  this.pos.add(this.vel);
  this.acc.mult(0);
}

Enemy.prototype.applyForce = function(x, y) {
  this.acc.add(x, y);
}

Enemy.prototype.move = function() {
  if (this.dir > 0 && this.inContact[1] || this.dir < 0 && this.inContact[0])
    this.dir *= -1;
  this.applyForce(this.dir * this.speed, 0);
}

Enemy.prototype.collision = function(pos, w, h) {
  var points = [pos.copy(), pos.copy().add(w, 0), pos.copy().add(w, h),
                pos.copy().add(0, h)];
  var out = false;
  for (var i = 0; i < 4; i++) {
    if (this.inside(points[i])) {
      out = true;
    }
  }
  return out;
}

Enemy.prototype.dead = function() {
  return this.outBounds();
}

Enemy.prototype.outBounds = function() {
  this.gridPos.set(floor(this.pos.x / blockWidth), floor(this.pos.y /
    blockWidth));

  if (this.gridPos.x < 1 || this.gridPos.x > 28 || this.gridPos.y > 28)
    return true;
  else {
    return false;
  }
}

Enemy.prototype.inside = function(p) {
  if (p.x >= this.pos.x && p.x <= this.pos.x + blockWidth) {
    if (p.y >= this.pos.y && p.y <= this.pos.y + blockWidth) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

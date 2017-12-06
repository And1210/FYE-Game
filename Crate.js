function Crate() {
  this.pos = createVector(0, 0);
  this.sprite = jacketSprite;
  this.sprite.resize(blockWidth, blockWidth);

  this.spawn();
}

Crate.prototype.spawn = function() {
  var loc = floor(random(surfaceBlocks.length));
  this.pos = surfaceBlocks[loc].pos.copy();
  this.pos.add(0, -blockWidth);
}

Crate.prototype.render = function() {
  noStroke();
  fill(0);
  // rect(this.pos.x, this.pos.y, blockWidth, blockWidth);
  image(this.sprite, this.pos.x, this.pos.y);
}

Crate.prototype.collision = function(pos, w, h) {
  var points = [pos.copy(), pos.copy().add(w, 0), pos.copy().add(w, h),
    pos.copy().add(0, h)
  ];
  var out = false;
  for (var i = 0; i < 4; i++) {
    if (this.inside(points[i])) {
      out = true;
    }
  }
  return out;
}

Crate.prototype.inside = function(p) {
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

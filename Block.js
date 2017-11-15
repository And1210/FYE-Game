function Block(x, y, w, h, type) {
  this.pos = createVector(x, y);
  this.colour = color(131, 111, 255);
  this.width = w;
  this.height = h;
  this.type = type;
  this.img = blockImg;
  this.img.resize(blockWidth, 0);
}

Block.prototype.setColour = function(r, g, b) {
  this.colour = color(r, g, b);
}

Block.prototype.render = function() {
  noStroke();
  fill(this.colour);
  //rect(this.pos.x, this.pos.y, this.width, this.height);
  if (this.type > 0) {
    image(blockImg, this.pos.x, this.pos.y);
  }
}

function Block(x, y, w, h, type) { //for type: 0 == left corner, 1 = center
  this.pos = createVector(x, y);
  this.colour = color(131, 111, 255);
  this.width = w;
  this.height = h;
  this.type = type;

}

Block.prototype.setColour = function(r, g, b) {
  this.colour = color(r, g, b);
}

Block.prototype.render = function() {
  noStroke();
  fill(this.colour);
  rect(this.pos.x, this.pos.y, this.width, this.height);
}

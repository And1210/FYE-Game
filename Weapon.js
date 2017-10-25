function Weapon(type) {
  this.type = type;
  this.properties;
  this.sprite;
}

Weapon.prototype.init = function() {
  this.properties = loadStrings("");

}

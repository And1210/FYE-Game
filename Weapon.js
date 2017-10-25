function Weapon(type) {
  this.type = type;
  this.properties;
  this.sprite;
  this.name;
  this.position;
  this.damage;
  this.fireRate; //frames/bullet
  this.width;
  this.height;
}

Weapon.prototype.init = function() {
  this.properties = loadStrings("weapons/weapon" + this.type + ".txt");

  for (var i = 0; i < this.properties.length; i++) {
    var t = split(this.properties[i], ": ");
    console.log(t);

    switch (t[0]) {
      case "name":
        this.name = t[1];
        break;
      case "position":
        this.position = t[1];
        break;
      case "damage":
        this.damage = t[1];
        break;
      case "fireRate":
        this.fireRate = t[1];
        break;
      case "width":
        this.width = t[1];
        break;
      case "height":
        this.height = t[1];
        break;
      default:
        break;
    }
  }
}

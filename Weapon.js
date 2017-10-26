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

  this.init();
}

Weapon.prototype.init = function() {
  this.properties = weaponProperties[this.type];

  for (var i = 0; i < this.properties.length; i++) {
    var t = split(this.properties[i], ": ");

    switch (t[0]) {
      case "name":
        this.name = t[1];
        break;
      case "position":
        this.position = t[1];
        break;
      case "damage":
        this.damage = parseInt(t[1]);
        break;
      case "fireRate":
        this.fireRate = parseInt(t[1]);
        break;
      case "width":
        this.width = parseInt(t[1]);
        break;
      case "height":
        this.height = parseInt(t[1]);
        break;
      default:
        break;
    }
  }
}

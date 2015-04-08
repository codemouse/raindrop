//TODO: write real tests :)

var raindrop = require('../lib/raindrop');

//create new raindrop with defaults
for (var i = 0; i < 100000; i++) {
  var drop = raindrop();
  console.log(drop.getRandomCounter())
}


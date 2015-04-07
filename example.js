var raindrop = require('./lib/raindrop');

var opt = {serviceTypeId: 1, entityTypeId: 4};
var drop = raindrop(opt);

console.log ("Timestamp: " + drop.getTimestamp());
console.log ("Machine Id: " + drop.getMachineId());
console.log ("Service Id: " + drop.getServiceId());
console.log ("Entity Type Id: " + drop.getEntityTypeId());
console.log ("RandomCounter: " + drop.getRandomCounter());

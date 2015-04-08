var raindrop = require('./lib/raindrop');

//create new raindrop with defaults
var drop = raindrop();

//get Raindrop Object
console.log (drop);

//set options for serviceTypeId and entityTypeId (0 - 255)
//set options for machineId (0 - 16777215)
var opt = {serviceTypeId: 1, entityTypeId: 4, machineId: 478444};

//create new raindrop with options
drop = raindrop(opt);

//get Raindrop Object
console.log (drop);

//get Raindrop Object as 16 character string
console.log (drop.toString());

//get Raindrop Object as 24 character decoded hex string
console.log (drop.toString(true));

//get Type info
console.log("Type: " + drop._type);

//get Timestamp portion up to the second as ISO 8601 date from UTC decoded
console.log("Timestamp: " + drop.getTimestamp());

//get MachineId decoded
console.log("Machine Id: " + drop.getMachineId());

//get ServiceId decoded
console.log("Service Id: " + drop.getServiceId());

//get EntityTypeId decoded
console.log("Entity Type Id: " + drop.getEntityTypeId());

//get RandomCounter decoded
console.log("RandomCounter: " + drop.getRandomCounter());

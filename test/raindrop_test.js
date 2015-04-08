//TODO: write real tests :)

var raindrop = require('../lib/raindrop');

//create new raindrop with defaults
var drop = raindrop();

//get Raindrop Object
console.log (drop);

//set options for serviceId and entityTypeId (0 - 255)
//set options for processId (0 - 16777215)
var opt = {serviceId: 1, entityTypeId: 4, processId: 478444};

//create new raindrop with options
drop = raindrop(opt);

//get Raindrop Object
console.log (drop);

//get Raindrop Object as 16 character string
console.log (drop.toString());

//get Raindrop Object as 24 character decoded hex string
console.log (drop.toString(true));

//get Type info (returns Raindrop Object type version according to installed Node package)
console.log("Type: " + drop.raindropType);

//get Timestamp portion up to the second as ISO 8601 date from UTC decoded
console.log("Timestamp: " + drop.getTimestamp());

//get Process Id decoded
console.log("Process Id: " + drop.getProcessId());

//get ServiceId decoded
console.log("Service Id: " + drop.getServiceId());

//get EntityTypeId decoded
console.log("Entity Type Id: " + drop.getEntityTypeId());

//get Counter decoded
console.log("Counter: " + drop.getCounter());

/*for (var i = 0; i < 100; i++) {
 drop = raindrop();
 console.log(drop.getCounter())
 }*/

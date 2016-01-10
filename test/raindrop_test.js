'use strict';

const raindrop = require('../lib/raindrop');

// create new raindrop with defaults
let drop = raindrop();

// get Raindrop Object
console.log(drop.id);

// set options for entityTypeId and serviceId (0 - 255)
// set options for processId (0 - 16777215)
const options = {
  'entityTypeId': 3,
  'processId': 78444,
  'serviceId': 3
};

// create new raindrop with options
drop = raindrop(options);

// get Raindrop Object
console.log(drop);

// get Raindrop Object as 16 character string
console.log(drop.id);

// get Raindrop Object as 24 character decoded hex string
console.log(drop.hexDecodedString);

// get Timestamp portion up to the second as ISO 8601 date from UTC decoded
console.log(`Timestamp: ${drop.timestamp}`);

// get EntityTypeId decoded
console.log(`Entity Type Id: ${drop.entityTypeId}`);

// get Process Id decoded
console.log(`Process Id: ${drop.processId}`);

// get ServiceId decoded
console.log(`Service Id: ${drop.serviceId}`);

// get Random decoded
console.log(`Random: ${drop.random}`);

// get Raindrop version info (returns Raindrop Object version)
console.log(`Version: ${drop.version}`);

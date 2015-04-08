# Raindrop

Raindrop is a distributed id generation utility that mimics the MongoDB ObjectID implementation, with a few key tweaks.

For information on the original ObjectID spec, see here: [http://docs.mongodb.org/manual/reference/object-id/#ObjectIDs-BSONObjectIDSpecification]

The Raindrop id is a 24 character hex string that is automatically encoded into a compact 16 character string represented with the following alphabet:

```
abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_
```

The core hex identifier is represented with the following attributes:

* 4-byte value representing the seconds since the Unix epoch (32-bit timestamp down to the second)
* 3-byte machine identifier (defaults to random value or user input)
* 1-byte microservice id (detaults to 0 or user input)
* 1-byte entity type id (defaults to 0 or user input)
* 3-byte counter, starting with a random value

This means the physical structure of the identifier's 5 components is:
```
FFFFFFFF FFFFFF FF FF FFFFFF
```

Raindrop is entirely deconstructable into its core values, to allow for the id to travel with key information regarding microservice origination id and domain-specific entity type identifiers.

##Getting Started

Install the module with: npm install raindrop

```
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

//get Type info (returns Raindrop Object version according to installed Node package)
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
```

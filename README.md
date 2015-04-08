# Raindrop

Raindrop is a distributed id generation utility that mimics the MongoDB BSON [ObjectID](http://docs.mongodb.org/manual/reference/object-id/#ObjectIDs-BSONObjectIDSpecification) implementation, with a few key tweaks.

The Raindrop id is a 24 character hex string that is automatically encoded into a compact 16 character string represented with the following alphabet:

```
abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_
```

The core hex identifier is represented with the following attributes:

* 4-byte value representing the seconds since the Unix epoch (32-bit timestamp down to the second)
* 3-byte machine identifier (defaults to random value or user input)
* 1-byte microservice id (detaults to 0 or user input)
* 1-byte entity type id (defaults to 0 or user input)
* 3-byte incremental counter, reset every second to a random start value

This means the physical structure of the identifier's 5 components is:
```
FFFFFFFF FFFFFF FF FF FFFFFF
```

Note: Once the 3-byte incremental counter hits the mediumint maximum (12,777,215), it will roll over to 0 and start again

Raindrop is entirely deconstructable into its core values, to allow for the id to travel with key information regarding microservice origination id and domain-specific entity type identifiers.

## Chance of collisions
Raindrop ids that are generated are highly likely to be unique across collections. The 3-byte incrementing counter is set to a random value every second an operation is performed. Therefore, a total of 16,777,215 unique ids could be inserted every second with the same machineId and the same microservice id, without chance of collision.
  
As long as machineId remains unique amongst all of your running processes, and your microservice id is always registered as being unique, and you do not try to store more than 16,777,215 ids per second, per machine id, per microservice id, you will avoid collisions.

It's recommended to have your microservice instance pass in a machineId likely a combination of machine identifier / MAC address along with a process id such as a PM2 cluster process identifier.

## Install
    $ npm install raindrop

## Usage
```javascript
var raindrop = require('./lib/raindrop');

//create new raindrop with defaults
var drop = raindrop();

//get Raindrop Object
console.log (drop);

//set options for serviceTypeId and entityTypeId (0 - 255)
//set options for machineId (0 - 16777214)
var opt = {serviceTypeId: 1, entityTypeId: 4, machineId: 478444};

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

//get MachineId decoded
console.log("Machine Id: " + drop.getMachineId());

//get ServiceId decoded
console.log("Service Id: " + drop.getServiceId());

//get EntityTypeId decoded
console.log("Entity Type Id: " + drop.getEntityTypeId());

//get Counter decoded
console.log("Counter: " + drop.getCounter());
```

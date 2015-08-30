# Raindrop

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] 
[![Build Status][travis-image]][travis-url] 
[![Code Climate][codeclimate-image]][codeclimate-url]

[![Dependency status][david-dm-image]][david-dm-url] 
[![peerDependency Status][daviddm-peer-image]][daviddm-peer-url]
[![devDependency Status][daviddm-dev-image]][daviddm-dev-url]

Raindrop is a distributed id generation utility that mimics the MongoDB BSON [ObjectID](http://docs.mongodb.org/manual/reference/object-id/#ObjectIDs-BSONObjectIDSpecification) implementation, with a few key tweaks.

The Raindrop is a 24 character hex string that is automatically encoded into a compact 16 character string represented with the following alphabet:

```
abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_
```

The core hex identifier is represented with the following attributes:

* 4-byte value representing the seconds since the Unix epoch (32-bit timestamp down to the second)
* 3-byte process identifier (defaults to random value or user input)
* 1-byte microservice id (defaults to 0 or user input)
* 1-byte entity type id (defaults to 0 or user input)
* 3-byte incremental counter, reset every second to a random start value

This means the physical structure of the identifier's 5 components is:
```
FFFFFFFF FFFFFF FF FF FFFFFF
```

Note: Once the 3-byte incremental counter hits the mediumint maximum (12,777,215), it will roll over to 0 and start again

Raindrop is entirely deconstructable into its core values, to allow for the id to travel with key information regarding microservice origination id and domain-specific entity type identifiers.

## Chance of collisions
Raindrops that are generated are highly likely to be unique across collections. The 3-byte incrementing counter is set to a random value every second an operation is performed. Therefore, a total of 16,777,215 unique ids could be inserted every second with the same unique process id and the same microservice id, without chance of collision.
  
As long as process id remains unique amongst all of your running processes, and your microservice id is always registered as being unique, and you do not try to store more than 16,777,215 ids per second, per process id, per microservice id, you will avoid collisions.

It's recommended to have your microservice instance pass in a process id likely a combination of machine identifier along with a process id such as a PM2 cluster process identifier.

## Motivation
You may be asking yourself, why not just use a GUID? Or perhaps a UUID generator? Isn't that good enough?  Maybe. But what if you care about storing some embedded internal domain specific data within your identifier? Why not have your identifier provide some information to help you out?  Raindrop gives you:

* Embeddable user-defined information to store 2 bytes of custom information, highly applicable across a tightly controlled microservice environment. Embed a marker with these attributes on issuing the id to help assist with type and service lookups later on.
* Avoid unnecessary lookups to your data store to determine service issuer and entity type. Create efficiency and optimization by decoding and parsing the information inline as you receive it.
* Reduces the overall id storage footprint by 32 bits over UUID.Raindrop is 96-bit, UUID is 128-bit. This can improve overall data storage efficiency.
* Uses a custom URL-safe alphabet beyond hex to shrink the represented string even further to just 16 characters. UUID/GUID will contain 32-38 characters. This is ideal where sending lengthy strings in URLs or message strings can impact performance.
* Based on an established distributed ID generation system in used by MongoDB. This is not reinventing the wheel; it's just painting the wheel a different color.

## Install
    $ npm install raindrop

## Usage
```javascript
var raindrop = require('./lib/raindrop');

//create new raindrop with defaults
var drop = raindrop();

//get Raindrop Object
console.log (drop);

//set options for processId (0 - 16777214)
//set options for serviceId and entityTypeId (0 - 255)
var opt = {processId: 478444, serviceId: 1, entityTypeId: 4};

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

//get Service Id decoded
console.log("Service Id: " + drop.getServiceId());

//get Entity Type Id decoded
console.log("Entity Type Id: " + drop.getEntityTypeId());

//get Counter decoded
console.log("Counter: " + drop.getCounter());
```

## License

MIT ©2015 [codemouse](http://codemouse.com)

[npm-url]: https://npmjs.org/package/raindrop
[downloads-image]: http://img.shields.io/npm/dm/raindrop.svg
[npm-image]: http://img.shields.io/npm/v/raindrop.svg
[travis-image]: http://img.shields.io/travis/codemouse/raindrop.svg
[travis-url]: https://travis-ci.org/codemouse/raindrop
[daviddm-image]: https://david-dm.org/codemouse/raindrop.svg
[daviddm-url]: https://david-dm.org/codemouse/raindrop
[daviddm-peer-image]: https://david-dm.org/codemouse/raindrop/peer-status.svg
[daviddm-peer-url]: https://david-dm.org/codemouse/raindrop#info=peerDependencies
[daviddm-dev-image]: https://david-dm.org/codemouse/raindrop/dev-status.svg
[daviddm-dev-url]: https://david-dm.org/codemouse/raindrop#info=devDependencies
[codeclimate-image]: https://codeclimate.com/github/codemouse/raindrop/badges/gpa.svg
[codeclimate-url]: https://codeclimate.com/github/codemouse/raindrop

# Raindrop

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url]

Raindrop is a distributed id generation utility that mimics the MongoDB BSON [ObjectID](http://docs.mongodb.org/manual/reference/object-id/#ObjectIDs-BSONObjectIDSpecification) implementation, with a few key tweaks.

The Raindrop is a 24 character hex string that is automatically encoded into a compact 16 character string represented with the following alphabet:

```
abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_
```

The core hex identifier is represented with the following attributes:

* 4-byte value representing the seconds since the Unix epoch (32-bit timestamp down to the second)
* 3-byte process identifier (defaults to random value or user input)
* 1-byte service id (defaults to 0 or user input)
* 1-byte entity type id (defaults to 0 or user input)
* 3-byte incremental counter, reset every second to a random start value

This means the physical structure of the identifier's 5 components is:

```
FFFFFFFF FFFFFF FF FF FFFFFF
```

Note: Once the 3-byte incremental counter hits the medium int maximum (16,777,215), it will roll over to 0 and start again.

Raindrop is entirely deconstructable into its core values, to allow for the id to travel with key information regarding service origination id and domain-specific entity type identifiers.

## Chance of collisions

Raindrops that are generated are highly likely to be unique across collections. The 3-byte incrementing counter is set to a random value every second an operation is performed. Therefore, a total of 16,777,215 unique ids could be inserted every second with the same unique process id and the same service id, without chance of collision.

As long as process id remains unique amongst all of your running processes, and your service id is always registered as being unique, and you do not try to store more than 16,777,215 ids per second, per process id, per service id, you will avoid collisions.

It is recommended to have your service instance pass in a process id — likely a combination of machine identifier along with a process id such as a PM2 cluster process identifier.

## Motivation

You may be asking yourself, why not just use a GUID? Or perhaps a UUID generator? Isn't that good enough? Maybe. But what if you care about storing some embedded internal domain specific data within your identifier? Why not have your identifier provide some information to help you out? Raindrop gives you:

* Embeddable user-defined information to store 2 bytes of custom information, highly applicable across a tightly controlled service environment. Embed a marker with these attributes on issuing the id to help assist with type and service lookups later on.
* Avoid unnecessary lookups to your data store to determine service issuer and entity type. Create efficiency and optimization by decoding and parsing the information inline as you receive it.
* Reduces the overall id storage footprint by 32 bits over UUID. Raindrop is 96-bit, UUID is 128-bit. This can improve overall data storage efficiency.
* Uses a custom URL-safe alphabet beyond hex to shrink the represented string even further to just 16 characters. UUID/GUID will contain 32-38 characters. This is ideal where sending lengthy strings in URLs or message strings can impact performance.
* Based on an established distributed ID generation system used by MongoDB. This is not reinventing the wheel; it's just painting the wheel a different color.

## Install

```
npm install raindrop
```

## Usage

### Zero-config

All fields default to 0 / a random process id. Useful for prototyping.

```typescript
import raindrop from 'raindrop';

const drop = raindrop();

console.log(drop.id);       // 16-char URL-safe string  e.g. "hI6vYt3mQpLwXs9n"
console.log(drop.hexId);    // 24-char hex              e.g. "68334a5e000000000000b2f1"
console.log(drop.version);  // semver string             e.g. "1.1.2"
```

### Service-aware ID

Real services should pin `processId` (machine + pid combo), `serviceId`, and `entityTypeId` so that IDs are decodable back to their origin.

```typescript
import raindrop from 'raindrop';
import type { RaindropOptions } from 'raindrop';

const opts: RaindropOptions = {
  processId:    7844,  // 0 – 16 777 215  (e.g. machine-id XOR process pid)
  serviceId:    1,     // 0 – 255
  entityTypeId: 4,     // 0 – 255
};

const drop = raindrop(opts);

console.log(drop.id);        // "hI6vYt3mQpLwXs9n"
console.log(drop.materials);
// {
//   timestamp:    "2026-05-25T00:00:00.000Z",
//   processId:    7844,
//   serviceId:    1,
//   entityTypeId: 4,
//   counter:      11506031
// }
```

### Decoding

`decoded()` reconstructs every field from the hex string alone — no database round-trip needed.

```typescript
const decoded = drop.decoded();

console.log(decoded.timestamp);    // "2026-05-25T00:00:00.000Z"  (ISO-8601, second precision)
console.log(decoded.processId);    // 7844
console.log(decoded.serviceId);    // 1
console.log(decoded.entityTypeId); // 4
console.log(decoded.counter);      // 11506031
```

### Equality

`equals()` compares both `id` and library version, so IDs from different package versions never silently compare as equal.

```typescript
const other = raindrop(opts);

console.log(drop.equals(drop));   // true
console.log(drop.equals(other));  // false
```

### Bulk generation

The counter increments monotonically within a second, so bulk IDs remain orderable by insertion time even in tight loops.

```typescript
const batch = Array.from({ length: 5 }, () => raindrop(opts));

batch.forEach((d, i) =>
  console.log(`[${i}] ${d.id}  counter=${d.decoded().counter}`)
);
// [0] hI6vYt3mQpLwXs9n  counter=11506031
// [1] hI6vYt3mQpLwXs9o  counter=11506032
// [2] hI6vYt3mQpLwXs9p  counter=11506033
// [3] hI6vYt3mQpLwXs9q  counter=11506034
// [4] hI6vYt3mQpLwXs9r  counter=11506035
```

> Run `npm run example` to execute a live demo covering all of the above.

## API

| Property / Method | Type | Description |
|---|---|---|
| `id` | `string` | 16-character URL-safe encoded ID |
| `hexId` | `string` | 24-character lowercase hex representation |
| `version` | `string` | Raindrop library version (semver) |
| `materials` | `RaindropMaterials` | Raw fields used to construct this ID |
| `decoded()` | `() => DecodedMaterials` | Deconstructs `hexId` back into its component fields |
| `equals(drop)` | `(Drop) => boolean` | Returns `true` if both IDs and versions match |

### Options (`RaindropOptions`)

| Field | Type | Range | Default |
|---|---|---|---|
| `entityTypeId` | `number` | 0 – 255 | `0` |
| `processId` | `number` | 0 – 16 777 215 | random |
| `serviceId` | `number` | 0 – 255 | `0` |

## License

MIT ©2026 [codemouse](http://codemouse.com)

[npm-url]: https://npmjs.org/package/raindrop
[downloads-image]: https://img.shields.io/npm/dm/raindrop.svg
[npm-image]: https://img.shields.io/npm/v/raindrop.svg


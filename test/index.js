'use strict'

const raindrop = require('../lib/raindrop')

// set options for entityTypeId (0 - 255)
// set options for processId (0 - 16777215)
// set options for serviceId (0 - 255)
const options = {
  'entityTypeId': 4,
  'processId': 7844,
  'serviceId': 1
}

// create new raindrop with options
const drop = raindrop(options)

// get Raindrop object
console.log(drop)

// get Raindrop version info (returns Raindrop object version)
console.log(`version: ${drop.version}`)

// get Raindrop object id as 16 character string
console.log(drop.id)

// get Raindrop object as 24 character hex string
console.log(drop.hexId)

// get Raindrop object materials property
console.log(drop.materials)

// get Raindrop object decoded properties
console.log(drop.decoded())

// get timestamp portion up to the second as ISO 8601 date from UTC
console.log(`timestamp: ${drop.decoded().timestamp}`)

// get entity type id decoded
console.log(`entity type id: ${drop.decoded().entityTypeId}`)

// get process id decoded
console.log(`process id: ${drop.decoded().processId}`)

// get service id decoded
console.log(`service id: ${drop.decoded().serviceId}`)

// get counter for that 1 second timestamp range decoded
console.log(`counter: ${drop.decoded().counter}`)

/* for (let i = 0; i < 100; i++) {
  const x = raindrop(options)

  console.log(x.decoded().counter)
} */

// see if one Raindrop object equals another

// true
console.log(drop.equals(drop))

const drop2 = raindrop(options)

// false
console.log(drop.equals(drop2))

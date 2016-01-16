'use strict'

const raindrop = require('../lib/raindrop')

// set options for entityTypeId and serviceId (0 - 255)
// set options for processId (0 - 16777215)
const options = {
  'entityTypeId': 4,
  'processId': 7844,
  'serviceId': 1
  // 'big': true
}

// create new raindrop with options
const drop = raindrop(options)

// get Raindrop object
console.log(drop)

// get Raindrop version info (returns Raindrop object version)
console.log(`Version: ${drop.version}`)

// get if Raindrop object is big Raindrop or not
// console.log(`Big Raindrop: ${drop.big}`)

// get Raindrop object id as 16 character string
console.log(drop.id)

// get Raindrop object decoded properties
console.log(drop.decoded())

// get Raindrop object as 24 character hex string
console.log(drop.decoded().hexId)

// get timestamp portion up to the second as ISO 8601 date from UTC
console.log(`Timestamp: ${drop.decoded().timestamp}`)

// get entity type id decoded
console.log(`Entity Type Id: ${drop.decoded().entityTypeId}`)

// get process id decoded
console.log(`Process Id: ${drop.decoded().processId}`)

// get service id decoded
console.log(`Service Id: ${drop.decoded().serviceId}`)

// get random decoded
console.log(`Random: ${drop.decoded().random}`)

// see if one Raindrop object equals another

// true
console.log(drop.equals(drop))

const drop2 = raindrop(options)

// false
console.log(drop.equals(drop2))

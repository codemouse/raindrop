'use strict'

const raindrop = require('../lib/raindrop')

// set options for entityTypeId and serviceId (0 - 255)
// set options for processId (0 - 16777215)
const options = {
  'entityTypeId': 3,
  'processId': 78444,
  'serviceId': 1
}

// create new raindrop with options
const drop = raindrop(options)

// get Raindrop object
console.log(drop)

// get Raindrop version info (returns Raindrop object version)
console.log(`Version: ${drop.version}`)

// get Raindrop object Id as 16 character string
console.log(drop.id)

// get Raindrop object decoded properties
console.log(drop.decoded())

// get Raindrop object as 24 character hex string
console.log(drop.decoded().hexId)

// get Timestamp portion up to the second as ISO 8601 date from UTC
console.log(`Timestamp: ${drop.decoded().timestamp}`)

// get Entity Type Id decoded
console.log(`Entity Type Id: ${drop.decoded().entityTypeId}`)

// get Process Id decoded
console.log(`Process Id: ${drop.decoded().processId}`)

// get Service Id decoded
console.log(`Service Id: ${drop.decoded().serviceId}`)

// get Random decoded
console.log(`Random: ${drop.decoded().random}`)

// see if one Raindrop object equals another
// true
console.log(drop.equals(drop))

const drop2 = raindrop(options)

// false
console.log(drop.equals(drop2))

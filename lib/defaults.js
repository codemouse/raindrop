'use strict'

const constants = require('./constants')

module.exports = {
  'entityTypeId': 0,
  'processId': parseInt(Math.random() * constants.uMedIntMax, 10),
  'serviceId': 0
}

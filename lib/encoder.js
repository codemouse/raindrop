'use strict'

const intEncoder = require('int-encoder')
const config = require('./config')
const constants = require('./constants')

intEncoder.alphabet = config.alphabet

module.exports = {
  'decode': (arg) => intEncoder.decode(arg, constants.radix16),
  'encode': (arg) => intEncoder.encode(arg, constants.radix16)
}

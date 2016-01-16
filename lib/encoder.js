'use strict'

const intEncoder = require('int-encoder')
const constants = require('./constants')

intEncoder.alphabet =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'

module.exports = {
  'decode': (arg) => intEncoder.decode(arg, constants.radix16),
  'encode': (arg) => intEncoder.encode(arg, constants.radix16)
}

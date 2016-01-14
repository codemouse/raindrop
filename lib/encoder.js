'use strict'

const IntEncoder = require('int-encoder')

IntEncoder.alphabet =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'

const base16 = 16

module.exports = {
  'decode': (arg) => IntEncoder.decode(arg, base16),
  'encode': (arg) => IntEncoder.encode(arg, base16)
}

'use strict';

const IntEncoder = require('int-encoder');

IntEncoder.alphabet =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';

const len = 16;

module.exports = {
  'decode': (arg) => IntEncoder.decode(arg, len),
  'encode': (arg) => IntEncoder.encode(arg, len)
};

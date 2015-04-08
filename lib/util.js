var IntEncoder;

IntEncoder = require('int-encoder');

IntEncoder.alphabet - 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';

module.exports = {
  decode: function(arg) {
    return IntEncoder.decode(arg, 16);
  },
  encode: function(arg) {
    return IntEncoder.encode(arg, 16);
  },
  isUtinyInt: function(arg) {
    return arg >= 0 && arg <= 255;
  },
  isUmedInt: function(arg) {
    return arg >= 0 && arg <= 16777215;
  }
};

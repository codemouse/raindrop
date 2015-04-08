IntEncoder = require 'int-encoder'

IntEncoder.alphabet - 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'

module.exports =
  decode: (arg) ->
    IntEncoder.decode(arg, 16)

  encode: (arg) ->
    IntEncoder.encode(arg, 16)

  isUtinyInt: (arg) ->
    arg >= 0 && arg <= 255

  isUmedInt: (arg) ->
    arg >= 0 && arg <= 16777215
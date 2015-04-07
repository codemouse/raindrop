_ = require 'lodash'
IntEncoder = require 'int-encoder'
Pack = require '../package.json'

Raindrop = (arg) ->
  return new Raindrop(arg)  unless this instanceof Raindrop

  return arg  if arg and ((arg instanceof Raindrop) or arg._type is 'Raindrop.' + Pack.version)

  buf = undefined
  if _.isString(arg)
    throw new Error('Argument passed in must be a single string of 16 characters.')  if arg.length isnt 16 and not Raindrop.isValid(decode(arg))
    buf = buffer(decode(arg))
  else if _.isObject(arg)
    buf = buffer(generate(arg))
  else
    throw new Error('Invalid argument passed. Must pass a single string of 16 characters, or arguments object containing serviceId and entityTypeId.')

  Object.defineProperty this, 'id',
    enumerable: true
    get: ->
      String.fromCharCode.apply this, buf

  Object.defineProperty this, 'str',
    get: ->
      buf.map(hex.bind(this, 2)).join ''

  Object.defineProperty this, 'estr',
    get: ->
      encode(buf.map(hex.bind(this, 2)).join '')

index = Raindrop.index = parseInt(Math.random() * 0xFFFFFF, 10)
machineId = parseInt(Math.random() * 0xFFFFFF, 10)

buffer = (str) ->
  i = undefined
  out = []
  if str.length is 24
    i = 0
    while i < 24
      out.push parseInt(str[i] + str[i + 1], 16)
      i += 2
  else if str.length is 12
    i = 0
    while i < 12
      out.push str.charCodeAt(i)
      i++
  out

decode = (arg) ->
  IntEncoder.decode(arg, 16)

encode = (arg) ->
  IntEncoder.encode(arg, 16)

generate = (arg) ->
  time = Date.now()
  time = parseInt(time, 10) % 0xFFFFFFFF

  sid = arg.serviceTypeId ? -1
  eid = arg.entityTypeId ? -1

  throw new Error('Service Id must be between 1 and 255')  if !(isTinyInt(sid))
  throw new Error('Entity Type Id must be between 1 and 255')  if !(isTinyInt(eid))

  #FFFFFFFF FFFFFF FF FF FFFFFF
  hex(8, time) + hex(6, machineId) + hex(2, sid) + hex(2, eid) + hex(6, next())

hex = (length, n) ->
  n = n.toString(16)
  (if (n.length is length) then n else '00000000'.substring(n.length, length) + n)

isTinyInt = (arg) ->
  arg >= 1 && arg <= 255

next = ->
  index = (index + 1) % 0xFFFFFF

Raindrop.createFromTime = (time) ->
  time = parseInt(time, 10) % 0xFFFFFFFF
  new Raindrop(hex(8, time) + '0000000000000000')

Raindrop.createFromHexString = (hexString) ->
  throw new Error('Invalid Raindrop hex string')  unless Raindrop.isValid(hexString)
  new Raindrop(hexString)

Raindrop.isValid = (raindrop) ->
  return false  unless raindrop
  /^[0-9A-F]{24}$/i.test raindrop.toString()

Raindrop.generate = generate

Raindrop:: =
  _type: 'Raindrop.' + Pack.version

  toHexString: (decoded) ->
    if decoded then @str else @estr

  equals: (other) ->
    !!other and @str is other.toString()

  getTimestamp: ->
    new Date(parseInt(@str.substr(0, 8), 16)* 1000).toISOString()

  getMachineId: ->
    parseInt @str.substr(8, 6), 16

  getServiceId: ->
    parseInt @str.substr(14, 2), 16

  getEntityTypeId: ->
    parseInt @str.substr(16, 2), 16

  getRandomCounter: ->
    parseInt @str.substr(18), 16

Raindrop::inspect = ->
  'Raindrop(' + this + ')'

Raindrop::toString = Raindrop::toHexString

module.exports = Raindrop

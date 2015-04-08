'use strict'

Pack = require '../package.json'
Util = require './util'
Config = require './config'

Raindrop = (arg) ->
  return new Raindrop(arg)  unless @ instanceof Raindrop

  return arg  if arg and
    ((arg instanceof Raindrop) or
      arg.raindropType is version)

  buf = undefined
  if typeof arg is 'string'
    throw new Error('Argument passed in must be a single string of 16 characters.')  if arg.length isnt 16 and
      not Raindrop.isValid(Util.decode(arg))
    buf = buffer(Util.decode(arg))
  else buf = buffer(generate(arg))  if /object|undefined/.test(typeof arg)

  Object.defineProperty @, 'id',
    enumerable: true
    get: ->
      String.fromCharCode.apply @, buf

  Object.defineProperty @, 'str',
    get: ->
      buf.map(hex.bind(@, 2)).join ''

  Object.defineProperty @, 'estr',
    get: ->
      Util.encode(buf.map(hex.bind(@, 2)).join '')

version = "Raindrop.#{Pack.version}"
index = parseInt(Math.random() * 0xFFFFFF, 10)
lastTimestamp = undefined

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

cycle = (timestamp) ->
  if /object|undefined/.test(typeof lastTimestamp)
    lastTimestamp = timestamp

  #change the counter every second
  if timestamp > lastTimestamp
    lastTimestamp = timestamp
    index = parseInt(Math.random() * 0xFFFFFF, 10)

generate = (arg) ->
  timestamp = parseInt(Date.now() / 1000, 10)
  cycle(timestamp)
  time = timestamp % 0xFFFFFFFF

  machineId = arg?.machineId ? Config.defaultMachineId
  sid = arg?.serviceTypeId ? Config.defaultSid
  eid = arg?.entityTypeId ? Config.defaultEid

  throw new Error('Machine Id must be between 0 and 16,777,214')  if !(Util.isUmedInt(machineId))
  throw new Error('Service Id must be between 0 and 255')  if !(Util.isUtinyInt(sid))
  throw new Error('Entity Type Id must be between 0 and 255')  if !(Util.isUtinyInt(eid))

  #FFFFFFFF FFFFFF FF FF FFFFFF
  hex(8, time) + hex(6, machineId) + hex(2, sid) + hex(2, eid) + hex(6, next())

hex = (length, n) ->
  n = n.toString(16)
  (if (n.length is length) then n else '00000000'.substring(n.length, length) + n)

next = ->
  index = (index + 1) % 0xFFFFFF

Raindrop.isValid = (raindrop) ->
  return false  unless raindrop
  /^[0-9A-F]{24}$/i.test raindrop.toString()

Raindrop.generate = generate

Raindrop:: =
  raindropType: version

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

  getCounter: ->
    parseInt @str.substr(18), 16

Raindrop::inspect = ->
  "Raindrop(#{@})"

Raindrop::toString = Raindrop::toHexString

module.exports = Raindrop

'use strict'

const pack = require('../package.json')
const encoder = require('./encoder')
const util = require('./util')
const config = require('./config')
const constants = require('./constants')

const buffer = (str) => {
  const out = []

  let c1 = null

  for (const chr of str) {
    if (c1 === null) {
      c1 = chr
    } else {
      out.push(parseInt(c1 + chr, constants.radix16))
      c1 = null
    }
  }

  return out
}

const hexString = (length, num) => {
  const str = num.toString(constants.radix16)

  if (str.length === length) {
    return str
  }

  if (str.length !== length) {
    return constants.hexStringMask.substring(str.length, length) + str
  }
}

const decodeMaterials = (hexId) => {
  const timestamp = new Date(
    parseInt(
      hexId.substr(
        config.timestampPositionStart, config.timestampBitSize
      ), constants.radix16
    ) * constants.second
  ).toISOString()

  const entityTypeId = parseInt(
    hexId.substr(config.entityTypeIdPositionStart,
      config.entityTypeIdBitSize),
    constants.radix16
  )

  const processId = parseInt(
    hexId.substr(config.processIdPositionStart,
      config.processIdBitSize),
    constants.radix16
  )

  const serviceId = parseInt(
    hexId.substr(config.serviceIdPositionStart,
      config.serviceIdBitSize),
    constants.radix16
  )

  const random = parseInt(
    hexId.substr(config.randomPositionStart),
    constants.radix16
  )

  return {
    hexId,
    timestamp,
    entityTypeId,
    processId,
    serviceId,
    random
  }
}

const equalityCheck = (hexId, version, drop2) => {
  const id2 = drop2 && drop2.id

  if (id2 == null) {
    return false
  }

  const version2 = drop2 && drop2.version

  if (version2 == null) {
    return false
  }

  const hexId2 = encoder.decode(id2)

  if (hexId2 == null) {
    return false
  }

  return hexId === hexId2 && version === version2
}

const generateDrop = (materials) => {
  const check = util.inputCheck(
    materials.entityTypeId, materials.processId, materials.serviceId
  )

  if (check !== null) {
    throw new Error(check)
  }

  const raindrop = hexString(config.timestampBitSize, materials.timestamp) +
    hexString(config.processIdBitSize, materials.processId) +
    hexString(config.serviceIdBitSize, materials.serviceId) +
    hexString(config.entityTypeIdBitSize, materials.entityTypeId) +
    hexString(config.randomBitSize, materials.random)

  return buffer(raindrop)
}

const materials = (arg, date, random) => {
  const timestamp =
    parseInt(date / constants.second, constants.radix10) % constants.uIntMax
  const entityTypeId = arg && arg.entityTypeId
  const processId = arg && arg.processId
  const serviceId = arg && arg.serviceId

  return {date, random, timestamp, entityTypeId, processId, serviceId}
}

const raindrop = (arg) => {
  const date = Date.now()
  const random = parseInt(
      Math.random() * constants.uMedIntMax, constants.radix10
    ) % constants.uIntMax

  const buf = generateDrop(materials(arg, date, random))

  const hexId = buf.map(hexString.bind(buf, 2)).join('')
  const id = encoder.encode(hexId);

  const version = pack.version

  // const big = false

  const decoded = () => decodeMaterials(hexId)
  const equals = (drop2) => equalityCheck(hexId, version, drop2)

  return {
    id,
    version,
    // big,
    decoded,
    equals
  }
}

module.exports = (arg) => raindrop(arg)

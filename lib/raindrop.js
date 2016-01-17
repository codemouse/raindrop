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
    return constants.hexStringIntMask.substring(str.length, length) + str
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

  const counter = parseInt(
    hexId.substr(config.counterPositionStart),
    constants.radix16
  )

  return {
    hexId,
    timestamp,
    entityTypeId,
    processId,
    serviceId,
    counter
  }
}

const equalityCheck = (hexId, version, drop2) => {
  const id2 = drop2 && drop2.id

  if (util.isNil(id2)) {
    return false
  }

  const version2 = drop2 && drop2.version

  if (util.isNil(version2)) {
    return false
  }

  const hexId2 = encoder.decode(id2)

  if (util.isNil(hexId2)) {
    return false
  }

  return hexId === hexId2 && version === version2
}

const generateDrop = (materials) => {
  const raindrop = hexString(config.timestampBitSize, materials.timestamp) +
    hexString(config.processIdBitSize, materials.processId) +
    hexString(config.serviceIdBitSize, materials.serviceId) +
    hexString(config.entityTypeIdBitSize, materials.entityTypeId) +
    hexString(config.counterBitSize, materials.counter)

  return buffer(raindrop)
}

let lastTimestamp = null

let counterStart = null

const getCounter =
  () => parseInt(Math.random() * constants.uMedIntMax, constants.radix10)

const getNextCounter =
  () => counterStart = (counterStart + 1) % constants.uMedIntMax

const getMaterials = (arg, date) => {
  const newTimestamp =
    parseInt(date / constants.second, constants.radix10)

  if (newTimestamp > lastTimestamp || util.isNil(lastTimestamp)) {
    lastTimestamp = newTimestamp
    counterStart = getCounter()
  }

  const timestamp = newTimestamp % constants.uIntMax

  const entityTypeId = arg && arg.entityTypeId
  const processId = arg && arg.processId
  const serviceId = arg && arg.serviceId

  const counter = getNextCounter()

  return {date, counter, timestamp, entityTypeId, processId, serviceId}
}

const raindrop = (arg) => {
  const date = Date.now()

  const materials = getMaterials(arg, date)

  if (
    !(
      util.isValid(materials.entityTypeId, constants.uTinyIntMax) &&
      util.isValid(materials.processId, constants.uMedIntMax) &&
      util.isValid(materials.serviceId, constants.uTinyIntMax)
    )
  ) {
    throw new Error('Materials for Raindrop generation are invalid')
  }

  const buf = generateDrop(materials)

  if (util.isNil(buf)) {
    throw new Error('An error has occurred in Raindrop generation')
  }

  const hexId = buf.map(hexString.bind(buf, 2)).join('')
  const id = encoder.encode(hexId);

  const version = pack.version

  const decoded = () => decodeMaterials(hexId)
  const equals = (drop2) => equalityCheck(hexId, version, drop2)

  return {
    id,
    version,
    decoded,
    equals
  }
}

module.exports = (arg) => raindrop(arg)

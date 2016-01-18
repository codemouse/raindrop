'use strict'

const pack = require('../package.json')
const encoder = require('./encoder')
const util = require('./util')
const config = require('./config')
const constants = require('./constants')
const shared = require('./shared')

const isEqual = (hexId, version, drop2) => {
  const id2 = drop2 && drop2.id

  if (util.isNil(drop2 && drop2.id)) {
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

const getCounter = () =>
  parseInt(Math.random() * constants.uMedIntMax, constants.radix10)

const getNextCounter = () =>
  shared.counterStart = (shared.counterStart + 1) % constants.uMedIntMax

const getMaterials = (arg, date) => {
  const timestamp = util.getTimestampNoMs(date)

  if (timestamp > shared.lastTimestamp || util.isNil(shared.lastTimestamp)) {
    shared.lastTimestamp = timestamp
    shared.counterStart = getCounter()
  }

  const entityTypeId = arg && arg.entityTypeId
  const processId = arg && arg.processId
  const serviceId = arg && arg.serviceId

  const counter = getNextCounter()

  return {timestamp, entityTypeId, processId, serviceId, counter}
}

const getMaterialsFromHex = (hexId) => {
  const timestamp =
    util.getIsoFormattedTimestampNoMs(
      util.getNumFromPosInHexString(
        hexId, config.timestampPositionStart, config.timestampBitSize
      )
    )

  const entityTypeId =
    util.getNumFromPosInHexString(
      hexId, config.entityTypeIdPositionStart, config.entityTypeIdBitSize
    )

  const processId =
    util.getNumFromPosInHexString(
      hexId, config.processIdPositionStart, config.processIdBitSize
    )

  const serviceId =
    util.getNumFromPosInHexString(
      hexId, config.serviceIdPositionStart, config.serviceIdBitSize
    )

  const counter =
    util.getNumFromPosInHexString(
      hexId, config.counterPositionStart
    )

  return {
    timestamp,
    entityTypeId,
    processId,
    serviceId,
    counter
  }
}

const getRaindropHexString = (materials) =>
  util.getMaskedHexString(config.timestampBitSize, materials.timestamp) +
  util.getMaskedHexString(config.processIdBitSize, materials.processId) +
  util.getMaskedHexString(config.serviceIdBitSize, materials.serviceId) +
  util.getMaskedHexString(config.entityTypeIdBitSize, materials.entityTypeId) +
  util.getMaskedHexString(config.counterBitSize, materials.counter)

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

  const version = pack.version

  const hexId = getRaindropHexString(materials)
  const id = encoder.encode(hexId);

  // TODO: update this to remove data mutation
  materials.timestamp = util.getIsoFormattedTimestampNoMs(materials.timestamp)

  const decoded = () => getMaterialsFromHex(hexId)
  const equals = (drop2) => isEqual(hexId, version, drop2)

  return {
    id,
    version,
    hexId,
    materials,
    decoded,
    equals
  }
}

module.exports = (arg) => raindrop(arg)

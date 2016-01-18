'use strict'

const constants = require('./constants')

const min = 0

const isNil =
  (val) => typeof val === 'undefined' || val === null

const isValidInRange =
  (num, max) => !isNaN(num) && num >= min && num <= max

const isValid = (val, max) => {
  if (!isValidInRange(val, max)) {
    throw new Error(`'${val}' must be a number between ${min} and ${max}`)
  }

  return true
}

const getTimestampNoMs = (date) =>
  parseInt(date / constants.second, constants.radix10) % constants.uIntMax

const getNumFromPosInHexString = (hexString, start, length) =>
  parseInt(hexString.substr(start, length), constants.radix16)

const getMaskedHexString = (length, num) => {
  const hexString = num.toString(constants.radix16)

  if (hexString.length === length) {
    return hexString
  }

  if (hexString.length !== length) {
    return constants.hexStringIntMask.substring(hexString.length, length) + hexString
  }
}

const getIsoFormattedTimestampNoMs = (num) =>
  new Date(num * constants.second).toISOString()

module.exports = {
  isNil,
  isValid,
  getTimestampNoMs,
  getNumFromPosInHexString,
  getMaskedHexString,
  getIsoFormattedTimestampNoMs
}

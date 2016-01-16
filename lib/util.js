'use strict'

const isValidInRange =
  (num, max) => !isNaN(num) && num >= 0 && num <= max

const isValid = (val, max) => {
  if (!isValidInRange(val, max)) {
    throw new Error(`'${val}' must be a number between 0 and ${max}`)
  }

  return true
}

const isNil =
  (val) => typeof val === 'undefined' || val === null

module.exports = {
  isValid,
  isNil
}

'use strict'

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

module.exports = {
  isNil,
  isValid
}

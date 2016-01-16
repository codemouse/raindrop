'use strict'

const constants = require('./constants')

const isUTinyInt =
  (num) => !isNaN(num) && num >= 0 && num <= constants.uTinyIntMax

const isUMedInt =
  (num) => !isNaN(num) && num >= 0 && num <= constants.uMedIntMax

const inputCheck = (entityTypeId, processId, serviceId) => {
  if (!isUTinyInt(entityTypeId)) {
    return 'Entity Type Id must be a number between 0 and 255'
  }

  if (!isUMedInt(processId)) {
    return 'Process Id must be a number between 0 and 16,777,215'
  }

  if (!isUTinyInt(serviceId)) {
    return 'Service Id must be a number between 0 and 255'
  }

  return null
}

const nilCheck =
  (val) => typeof val === 'undefined' || val === null

module.exports = {
  inputCheck,
  nilCheck
}

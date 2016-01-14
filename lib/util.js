'use strict';

const constants = require('./constants');

const isUTinyInt = (num) => num >= 0 && num <= constants.uTinyIntMax;

const isUMedInt = (num) => num >= 0 && num <= constants.uMedIntMax;

const checkInput = (entityTypeId, processId, serviceId) => {
  if (!isUTinyInt(entityTypeId)) {
    return 'Entity Type Id must be between 0 and 255';
  }

  if (!isUMedInt(processId)) {
    return 'Process Id must be between 0 and 16,777,215';
  }

  if (!isUTinyInt(serviceId)) {
    return 'Service Id must be between 0 and 255';
  }

  return null;
};

module.exports = {
  checkInput: checkInput
};

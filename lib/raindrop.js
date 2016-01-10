'use strict';

const pack = require('../package.json');
const defaults = require('./defaults');
const encoder = require('./encoder');

const timestampBitSize = 8;
const processIdBitSize = 6;
const serviceIdBitSize = 2;
const entityTypeIdBitSize = 2;
const randBitSize = 6;

const timestampPositionStart = 0;
const processIdPositionStart = 8;
const serviceIdPositionStart = 14;
const entityTypeIdPositionStart = 16;
const randomPositionStart = 18;

const radix10 = 10;
const radix16 = 16;
const second = 1000;

// 255 - 8bit
const tinyIntMax = 0xff;

// 16777215 - 24bit
const medIntMax = 0xffffffff;

const buffer = (str) => {
  const out = [];

  let c1 = null;

  for (const chr of str) {
    if (c1 === null) {
      c1 = chr;
    } else {
      out.push(parseInt(c1 + chr, radix16));
      c1 = null;
    }
  }

  return out;
};

const isUTinyInt = (num) => num >= 0 && num <= tinyIntMax;

const isUMedInt = (num) => num >= 0 && num <= medIntMax;

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

const hexString = (length, num) => {
  const str = num.toString(radix16);

  if (str.length === length) {
    return str;
  }

  if (str.length !== length) {
    return '00000000'.substring(str.length, length) + str;
  }
};

const generate = (arg) => {
  const timestamp = parseInt(Date.now() / second, radix10) % medIntMax;
  const entityTypeId = arg && arg.entityTypeId || defaults.entityTypeId;
  const processId = arg && arg.processId || defaults.processId;
  const serviceId = arg && arg.serviceId || defaults.serviceId;
  const rand = parseInt(Math.random() * medIntMax, radix10) % medIntMax;

  const check = checkInput(entityTypeId, processId, serviceId);

  if (check !== null) {
    throw new Error(check);
  }

  return hexString(timestampBitSize, timestamp) +
    hexString(processIdBitSize, processId) +
    hexString(serviceIdBitSize, serviceId) +
    hexString(entityTypeIdBitSize, entityTypeId) +
    hexString(randBitSize, rand);
};

module.exports = (arg) => {
  const buf = buffer(generate(arg));
  const str = buf.map(hexString.bind(this, 2)).join('');

  return {
    'id': encoder.encode(str),
    'timestamp':
      new Date(
        parseInt(
          str.substr(
            timestampPositionStart, timestampBitSize
          ), radix16
        ) * second
      ).toISOString(),
    'hexDecodedString': str,
    'entityTypeId':
      parseInt(
        str.substr(entityTypeIdPositionStart, entityTypeIdBitSize), radix16
      ),
    'processId':
      parseInt(str.substr(processIdPositionStart, processIdBitSize), radix16),
    'serviceId':
      parseInt(str.substr(serviceIdPositionStart, serviceIdBitSize), radix16),
    'random': parseInt(str.substr(randomPositionStart), radix16),
    'version': pack.version
  };
};

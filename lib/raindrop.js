'use strict';

const pack = require('../package.json');
const defaults = require('./defaults');
const encoder = require('./encoder');
const util = require('./util');
const config = require('./config');
const constants = require('./constants');

const buffer = (str) => {
  const out = [];

  let c1 = null;

  for (const chr of str) {
    if (c1 === null) {
      c1 = chr;
    } else {
      out.push(parseInt(c1 + chr, constants.radix16));
      c1 = null;
    }
  }

  return out;
};

const hexString = (length, num) => {
  const str = num.toString(constants.radix16);

  if (str.length === length) {
    return str;
  }

  if (str.length !== length) {
    return constants.hexStringMask.substring(str.length, length) + str;
  }
};

//bjs simplify this and put decode as separate function calls
module.exports = (arg) => {
  const date = Date.now();
  const rand = parseInt(
      Math.random() * constants.uMedIntMax, constants.radix10
    ) % constants.uIntMax;

  const timestamp =
    parseInt(date / constants.second, constants.radix10) % constants.uIntMax;
  const entityTypeId = arg && arg.entityTypeId || defaults.entityTypeId;
  const processId = arg && arg.processId || defaults.processId;
  const serviceId = arg && arg.serviceId || defaults.serviceId;

  const check = util.checkInput(entityTypeId, processId, serviceId);

  if (check !== null) {
    throw new Error(check);
  }

  const raindrop = hexString(config.timestampBitSize, timestamp) +
    hexString(config.processIdBitSize, processId) +
    hexString(config.serviceIdBitSize, serviceId) +
    hexString(config.entityTypeIdBitSize, entityTypeId) +
    hexString(config.randomBitSize, rand);

  const buf = buffer(raindrop);

  const str = buf.map(hexString.bind(buf, 2)).join('');

  return {
    'id': encoder.encode(str),
    'hexString': str,
    'timestamp': new Date(date).toISOString(),
    'timestampDecoded':
      new Date(
        parseInt(
          str.substr(
            config.timestampPositionStart, config.timestampBitSize
          ), constants.radix16
        ) * constants.second
      ).toISOString(),
    entityTypeId,
    'entityTypeIdDecoded':
      parseInt(
        str.substr(config.entityTypeIdPositionStart,
          config.entityTypeIdBitSize),
        constants.radix16
      ),
    processId,
    'processIdDecoded':
      parseInt(str.substr(config.processIdPositionStart,
          config.processIdBitSize),
        constants.radix16),
    serviceId,
    'serviceIdDecoded':
      parseInt(str.substr(config.serviceIdPositionStart,
          config.serviceIdBitSize),
        constants.radix16),
    'random': rand,
    'randomDecoded': parseInt(str.substr(config.randomPositionStart),
      constants.radix16),
    'version': pack.version
  };
};

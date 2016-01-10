'use strict';

//TODO: put back in counter instead of random (shared state) and add in bigDrop (128-bit instead of 96-bit, and tests)

const pack = require('../package.json');
const defaults = require('./defaults');
const encoder = require('./encoder');

const buffer = (str) => {
  const out = [];

  let c1 = null;

  for (const chr of str) {
    if (c1 === null) {
      c1 = chr;
    } else {
      out.push(parseInt(c1 + chr, 16));
      c1 = null;
    }
  }

  return out;
};

const checkInput = (entityTypeId, processId, serviceId) => {
  const isUTinyInt = (x) => x >= 0 && x <= 255;
  const isUMedInt = (x) => x >= 0 && x <= 16777214;

  if (!isUTinyInt(entityTypeId)) {
    return 'Entity Type Id must be between 0 and 255';
  }

  if (!isUMedInt(processId)) {
    return 'Process Id must be between 0 and 16,777,214';
  }

  if (!isUTinyInt(serviceId)) {
    return 'Service Id must be between 0 and 255';
  }

  return null;
};

const generate = (arg) => {
  const timestamp = parseInt(Date.now() / 1000, 10) % 0xFFFFFFFF;
  const entityTypeId = arg && arg.entityTypeId || defaults.entityTypeId;
  const processId = arg && arg.processId || defaults.processId;
  const serviceId = arg && arg.serviceId || defaults.serviceId;
  const rand = parseInt(Math.random() * 0xFFFFFF, 10) % 0xFFFFFF;

  const check = checkInput(entityTypeId, processId, serviceId);

  if (check !== null) {
    throw new Error(check);
  }

  return hex(8, timestamp) + hex(6, processId) + hex(2, serviceId) + hex(2, entityTypeId) + hex(6, rand);
};

const hex = (length, n) => {
  const s = n.toString(16);

  if (s.length === length) {
    return s;
  }

  if (s.length !== length) {
    return '00000000'.substring(s.length, length) + s;
  }
};

const raindrop = (arg) => {
  const buf = buffer(generate(arg));
  const str = buf.map(hex.bind(this, 2)).join('');
  const encodedStr = encoder.encode(buf.map(hex.bind(this, 2)).join(''));

  return {
    'id': encodedStr,
    'timestamp': new Date(parseInt(str.substr(0, 8), 16) * 1000).toISOString(),
    'hexDecodedString': str,
    'entityTypeId': parseInt(str.substr(16, 2), 16),
    'processId': parseInt(str.substr(8, 6), 16),
    'serviceId': parseInt(str.substr(14, 2), 16),
    'random': parseInt(str.substr(18), 16),
    'version': pack.version
  };
};

module.exports = raindrop;

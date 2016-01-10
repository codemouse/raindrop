'use strict';

/* TODO: put back in counter instead of random (shared state) and
 add in bigDrop (128-bit instead of 96-bit, and tests)*/

const pack = require('../package.json');
const defaults = require('./defaults');
const encoder = require('./encoder');

const timestampBitLength = 8;
const processIdBitLength = 8;
const serviceIdBitLength = 2;
const entityTypeIdBitLength = 2;
const randBitLength = 6;

const timestampPositionStart = 0;
const processIdPositionStart = 8;
const serviceIdPositionStart = 14;
const entityTypeIdPositionStart = 16;
const randomPositionStart = 18;

const base10 = 10;
const base16 = 16;
const second = 1000;
const hexMax = 0xFFFFFFFF;

const tinyIntMax = 255;
const medIntMax = 16777214;

const buffer = (str) => {
  const out = [];

  let c1 = null;

  for (const chr of str) {
    if (c1 === null) {
      c1 = chr;
    } else {
      out.push(parseInt(c1 + chr, base16));
      c1 = null;
    }
  }

  return out;
};

const checkInput = (entityTypeId, processId, serviceId) => {
  const isUTinyInt = (x) => x >= 0 && x <= tinyIntMax;
  const isUMedInt = (x) => x >= 0 && x <= medIntMax;

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

const hex = (length, n) => {
  const s = n.toString(base16);

  if (s.length === length) {
    return s;
  }

  if (s.length !== length) {
    return '00000000'.substring(s.length, length) + s;
  }
};

const generate = (arg) => {
  const timestamp = parseInt(Date.now() / second, base10) % hexMax;
  const entityTypeId = arg && arg.entityTypeId || defaults.entityTypeId;
  const processId = arg && arg.processId || defaults.processId;
  const serviceId = arg && arg.serviceId || defaults.serviceId;
  const rand = parseInt(Math.random() * hexMax, base10) % hexMax;

  const check = checkInput(entityTypeId, processId, serviceId);

  if (check !== null) {
    throw new Error(check);
  }

  return hex(timestampBitLength, timestamp) +
    hex(processIdBitLength, processId) +
    hex(serviceIdBitLength, serviceId) +
    hex(entityTypeIdBitLength, entityTypeId) +
    hex(randBitLength, rand);
};

const raindrop = (arg) => {
  const buf = buffer(generate(arg));
  const str = buf.map(hex.bind(this, 2)).join('');
  const encodedStr = encoder.encode(buf.map(hex.bind(this, 2)).join(''));

  return {
    'id': encodedStr,
    'timestamp': new Date(parseInt(str.substr(timestampPositionStart, timestampBitLength), base16) * second).toISOString(),
    'hexDecodedString': str,
    'entityTypeId': parseInt(str.substr(entityTypeIdPositionStart, entityTypeIdBitLength), base16),
    'processId': parseInt(str.substr(processIdPositionStart, processIdBitLength), base16),
    'serviceId': parseInt(str.substr(serviceIdPositionStart, serviceIdBitLength), base16),
    'random': parseInt(str.substr(randomPositionStart), base16),
    'version': pack.version
  };
};

module.exports = raindrop;

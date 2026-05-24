import { randomInt } from 'crypto';
import * as encoder from './encoder';
import * as util from './util';
import * as config from './config';
import * as constants from './constants';
import { shared } from './shared';
import { version } from './version';

export interface RaindropOptions {
  entityTypeId?: number;
  processId?: number;
  serviceId?: number;
}

export interface RaindropMaterials {
  timestamp: string;
  entityTypeId: number | undefined;
  processId: number | undefined;
  serviceId: number | undefined;
  counter: number;
}

export interface DecodedMaterials {
  timestamp: string;
  entityTypeId: number;
  processId: number;
  serviceId: number;
  counter: number;
}

export interface Drop {
  id: string;
  version: string;
  hexId: string;
  materials: RaindropMaterials;
  decoded: () => DecodedMaterials;
  equals: (drop2: Drop) => boolean;
}

interface Materials {
  timestamp: number;
  entityTypeId: number | undefined;
  processId: number | undefined;
  serviceId: number | undefined;
  counter: number;
}

const isEqual = (hexId: string, ver: string, drop2: Drop): boolean => {
  const id2 = drop2?.id;

  if (util.isNil(id2)) {
    return false;
  }

  const version2 = drop2?.version;

  if (util.isNil(version2)) {
    return false;
  }

  const hexId2 = encoder.decode(id2);

  return hexId === hexId2 && ver === version2;
};

const getCounter = (): number => randomInt(constants.uMedIntMax);

const getNextCounter = (): number => {
  shared.counterStart = ((shared.counterStart ?? 0) + 1) % constants.uMedIntMax;
  return shared.counterStart;
};

const getMaterials = (arg: RaindropOptions | undefined, date: number): Materials => {
  const timestamp = util.getTimestampNoMs(date);

  if (timestamp > (shared.lastTimestamp ?? -1)) {
    shared.lastTimestamp = timestamp;
    shared.counterStart = getCounter();
  }

  const counter = getNextCounter();

  return {
    timestamp,
    entityTypeId: arg?.entityTypeId,
    processId: arg?.processId,
    serviceId: arg?.serviceId,
    counter,
  };
};

const getMaterialsFromHex = (hexId: string): DecodedMaterials => {
  const timestamp = util.getIsoFormattedTimestampNoMs(
    util.getNumFromPosInHexString(hexId, config.timestampPositionStart, config.timestampBitSize),
  );

  const entityTypeId = util.getNumFromPosInHexString(
    hexId, config.entityTypeIdPositionStart, config.entityTypeIdBitSize,
  );

  const processId = util.getNumFromPosInHexString(
    hexId, config.processIdPositionStart, config.processIdBitSize,
  );

  const serviceId = util.getNumFromPosInHexString(
    hexId, config.serviceIdPositionStart, config.serviceIdBitSize,
  );

  const counter = util.getNumFromPosInHexString(hexId, config.counterPositionStart);

  return { timestamp, entityTypeId, processId, serviceId, counter };
};

const getRaindropHexString = (materials: Materials): string =>
  util.getMaskedHexString(config.timestampBitSize, materials.timestamp) +
  util.getMaskedHexString(config.processIdBitSize, materials.processId ?? 0) +
  util.getMaskedHexString(config.serviceIdBitSize, materials.serviceId ?? 0) +
  util.getMaskedHexString(config.entityTypeIdBitSize, materials.entityTypeId ?? 0) +
  util.getMaskedHexString(config.counterBitSize, materials.counter);

export const raindrop = (arg?: RaindropOptions): Drop => {
  const date = Date.now();
  const materials = getMaterials(arg, date);

  util.isValid(materials.entityTypeId ?? 0, constants.uTinyIntMax);
  util.isValid(materials.processId ?? 0, constants.uMedIntMax);
  util.isValid(materials.serviceId ?? 0, constants.uTinyIntMax);

  const hexId = getRaindropHexString(materials);
  const id = encoder.encode(hexId);

  const raindropMaterials: RaindropMaterials = {
    timestamp: util.getIsoFormattedTimestampNoMs(materials.timestamp),
    entityTypeId: materials.entityTypeId,
    processId: materials.processId,
    serviceId: materials.serviceId,
    counter: materials.counter,
  };

  const decoded = (): DecodedMaterials => getMaterialsFromHex(hexId);
  const equals = (drop2: Drop): boolean => isEqual(hexId, version, drop2);

  return { id, version, hexId, materials: raindropMaterials, decoded, equals };
};

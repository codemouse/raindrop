import { second, radix16, uIntMax } from './constants';

const min = 0;

const isValidInRange = (num: number, max: number): boolean =>
  num >= min && num <= max;

export const isValid = (val: unknown, max: number): void => {
  if (!isValidInRange(val as number, max)) {
    throw new Error(`'${val}' must be a number between ${min} and ${max}`);
  }
};

export const getTimestampNoMs = (date: number): number =>
  Math.floor(date / second) % uIntMax;

export const getNumFromPosInHexString = (
  hexString: string,
  start: number,
  length?: number,
): number =>
  parseInt(
    hexString.slice(start, length !== undefined ? start + length : undefined),
    radix16,
  );

export const getMaskedHexString = (length: number, num: number): string =>
  num.toString(radix16).padStart(length, '0');

export const getIsoFormattedTimestampNoMs = (num: number): string =>
  new Date(num * second).toISOString();

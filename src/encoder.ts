import intEncoder = require('int-encoder');
import { alphabet } from './config';
import { radix16 } from './constants';

intEncoder.alphabet = alphabet;

export const decode = (arg: string): string => intEncoder.decode(arg, radix16);
export const encode = (arg: string): string => intEncoder.encode(arg, radix16);

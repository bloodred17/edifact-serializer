import { EdifactSegment } from './serializer.classes';

export const segmentTags = [
  'TAX',
  'UNT',
  'UNB',
  'UNH',
  'BGM',
  'CST',
  'LOC',
  'DTM',
  'GIS',
  'MEA',
  'EQD',
  'FTX',
  'RFF',
  'PAC',
  'PCI',
  'TDT',
  'DOC',
  'NAD',
  'UNS',
  'MOA',
  'UNZ'
];
export type SegmentTag = typeof segmentTags[number];

export enum UseStatus {
  M = 'mandatory',
  C = 'conditional'
}
export const elementValueTypes = ['a', 'n', 'an'];
export type ElementValueType = typeof elementValueTypes[number];

export const lengthTypes = ['fixed', 'variable'];
export type LengthType = typeof lengthTypes[number];

export interface Pattern {
  name: string,
  regex: RegExp,
}
export const patterns: Pattern[] = [
  { name: 'a_fixed', regex: /(^a+[0-9]+)/ },
  { name: 'an_fixed', regex: /(^an+[0-9]+)/ },
  { name: 'n_fixed', regex: /(^n+[0-9]+)/ },
  { name: 'a_variable', regex: /(^a\.\.+[0-9]+)/ },
  { name: 'an_variable', regex: /(^an\.\.+[0-9]+)/ },
  { name: 'n_variable', regex: /(^n\.\.+[0-9]+)/ },
];

export interface Message {
  segment: EdifactSegment;
  data: any;
}

export class Interchange {
  una: EdifactSegment;
  unb: EdifactSegment;
  message: EdifactSegment[];
  unz: EdifactSegment;
}

import { validate } from 'class-validator';
import { EdifactCompositeElement, EdifactElement, EdifactSegment } from './serializer.classes';
import { ElementValueType, LengthType, Message, Pattern, patterns, UseStatus } from './serializer.types';

type Format = {
  valueType: ElementValueType,
  lengthType: LengthType,
  length: number,
}
/**
 * Parses the EDIFACT data format string to useful values that can be used to validate the value
 * @param str
 * @return {Format} valueType, lengthType, length
 */
export function getElementFormat(str: string): Format {
  const digitIndex = str.search(/([0-9]+)/);
  if (!digitIndex) {
    throw new Error('No length found in ' + str);
  }
  const filtered = patterns.filter((pattern: Pattern) => {
    return pattern?.regex.test(str);
  });
  if (filtered.length === 0 || filtered.length > 1) {
    throw new Error('Invalid format ' + str);
  }
  const pattern = filtered[0];
  const split = pattern?.name?.split('_');
  return {
    valueType: split[0] as ElementValueType,
    lengthType: split[split.length - 1] as LengthType,
    length: +str.substring(digitIndex)
  };
}

/**
 * Validates the value based on the EdifactElement definition
 * @param element {EdifactElement} Edifact single Element
 * @param value {string} value that is supposed to be serialized
 * @return {boolean} true if valid and throws error if invalid
 */
export function validateValue(element: EdifactElement, value: string): boolean {
  const { valueType, lengthType, maxLength, name } = element;
  let condition: boolean | undefined = undefined;

  if (!maxLength) {
    throw new Error(`maxLength of ${element.name} cannot be ${maxLength}`)
  }
  if (!lengthType) {
    throw new Error(`lengthType of ${element.name} cannot be ${lengthType}`);
  }
  switch (lengthType) {
    case 'fixed':
      condition = value.length === maxLength;
      if (!condition) throw new Error(`Length of ${name} should be equal to ${maxLength}`);
      break;

    case 'variable':
      condition = value.length <= maxLength;
      if (!condition) throw new Error(`Length of ${name} should be less than or equal to ${maxLength}`);
      break;
  }

  if (!valueType) {
    throw new Error(`valueType of ${element.name} cannot be ${valueType}`);
  }
  if (value) {
    switch (valueType) {
      case 'a':
        condition = /^[a-zA-Z]+$/.test(value);
        if (!condition) throw new Error(`${name} should be alphabetic`);
        break;

      case 'n':
        condition = /(^[0-9]+[0-9.]+[0-9]+$)|(^[0-9]+$)/.test(value);
        if (!condition) throw new Error(`${name} should be numeric`);
        break;

      case 'an':
        condition = /^[a-zA-Z0-9,\-\s]+$/.test(value);
        if (!condition) throw new Error(`${name} should be alpha numeric`);
        break;
    }
  }

  return condition as boolean;
}

/**
 * Renders EDIFACT message for a segment
 * @param segment {EdifactSegment} Edifact Segment
 * @param data {any} Map of key value where the keys are segment's single element identifiers.
 * @return {string}
 */
export const renderSegment = (segment: EdifactSegment, data): string => {
  let result = '';
  for (const element of segment.elements) {
    // result += '+';
    let res = '';
    let isSubLast = false;
    if (element instanceof EdifactCompositeElement) {
      for (const [i, dataElement] of Object.entries(element.elements)) {
        if (+i === element.elements.length - 1) isSubLast = true;
        const value = data[dataElement.name];
        if ((value === null || value === undefined)) {
          if ((dataElement.status === UseStatus.M)) {
            throw new Error(`'${segment?.name} -> ${element?.name} -> ${dataElement.name}' can not be ${value}`)
          } else {
            break;
          }
        }
        const condition = validateValue(dataElement, value);
        if (!condition) {
          throw new Error(`'${element?.name} -> ${element?.name} -> ${dataElement.name}' can not be ${condition}`)
        }
        if (condition) {
          res += ((+i > 0) ? ':' : '') + value;
        }
      }
    }
    if (element instanceof EdifactElement) {
      const value = data[element.name];
      if (value === null || value === undefined) {
        if (element.status === UseStatus.M) {
          throw new Error(`'${element?.name} -> ${element.name}' can not be ${value}`)
        } else {
          break;
        }
      }
      const condition = validateValue(element, value);
      if (!condition) {
        throw new Error(`'${element?.name} -> ${element.name}' can not be ${condition}`)
      }
      if (condition) {
        res += data[element.name]
      }
    }
    if (element.status === UseStatus.C && res === '' && isSubLast) {
      continue;
    }
    result += '+' + res;
  }
  return `${segment.tag}${result}'`
}

/**
 * Renders serialized EDIFACT interchange message based on the input messages array
 * @param messages {Message[]}
 * @return {string}
 */
export const renderInterchangeMessage = async (messages: Message[]) => {
  let result = '';
  for (const message of messages) {
    const errors = await validate(message.segment);
    if (errors?.length > 0) {
      console.log(JSON.stringify(errors, undefined, 2));
      throw new Error(`${message.segment.name} validation failed`);
    }
    const msg = renderSegment(message.segment, message.data);
    result += msg;
    console.log(msg);
    // console.log('\n');
  }
  return result;
}

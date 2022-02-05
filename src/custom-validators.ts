import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { segmentTags } from './serializer.types';
import { getElementFormat } from './serializer.utility';

@ValidatorConstraint({ name: 'format', async: false })
export class Format implements ValidatorConstraintInterface {
  validate(text: string) {
    try {
      const {valueType, lengthType, length} = getElementFormat(text);
      return ['a', 'an', 'n'].includes(valueType) &&
        ['fixed', 'variable'].includes(lengthType) && !isNaN(length);
    } catch (e) {
      return false;
    }
  }

  defaultMessage() {
    return `Incorrect format`;
  }
}

export function IsNotNan(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isNotNan',
      target: object.constructor,
      propertyName: propertyName,
      options: { ...validationOptions, message: 'This string should contain a numeric value' },
      validator: {
        validate(value: any) {
          return typeof value === 'string' && !isNaN(+value);
        },
      },
    });
  };
}

export function IsSegmentTag(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isSegmentTag',
      target: object.constructor,
      propertyName: propertyName,
      options: { ...validationOptions, message: 'This string should be of type SegmentTag' },
      validator: {
        validate(value: any) {
          return (typeof value === 'string') && (segmentTags.includes(value));
        },
      },
    });
  };
}

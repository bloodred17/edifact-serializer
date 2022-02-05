import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Validate,
  ValidateNested,
} from 'class-validator';
import { Format, IsNotNan } from './custom-validators';
import {
  ElementValueType,
  elementValueTypes,
  LengthType,
  lengthTypes,
  SegmentTag,
  UseStatus,
} from './serializer.types';
import { getElementFormat } from './serializer.utility';

export class EdifactElement {
  @IsNotEmpty()
  @IsString()
  tag: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEnum(UseStatus)
  status: UseStatus;

  @IsOptional()
  @IsString()
  @Validate(Format)
  format?: string;

  @IsOptional()
  @IsString()
  @Length(1,2)
  @IsIn(elementValueTypes)
  valueType?: ElementValueType;

  @IsOptional()
  @IsString()
  @IsIn(lengthTypes)
  lengthType?: LengthType;

  @IsOptional()
  @IsNumber()
  maxLength?: number;

  constructor(init?: Partial<EdifactElement>) {
    if (init) {
      Object.assign(this, init);
    }
  }

  set _format(value: string) {
    this.format = value;
    const { valueType, lengthType, length } = getElementFormat(value);
    this.valueType = valueType;
    this.lengthType = lengthType;
    this.maxLength = length;
  }
}

export class EdifactCompositeElement {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  tag: string;

  @IsEnum(UseStatus)
  status: UseStatus;

  @ValidateNested()
  elements: EdifactElement[];

  constructor(init?: Partial<EdifactCompositeElement>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}

export class EdifactSegment {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  // @Length(3,3)
  // @IsIn(segmentTags)
  tag: SegmentTag;

  @ValidateNested()
  elements: (EdifactElement | EdifactCompositeElement)[];

  @IsOptional()
  @IsString()
  @IsNotNan()
  counter?: string;

  @IsOptional()
  @IsNumber()
  number?: number;

  @IsOptional()
  @IsNumber()
  level?: number;

  constructor(init?: Partial<EdifactSegment>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}

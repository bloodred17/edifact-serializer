# edifact-serializer

[comment]: <> ([![Sponsor][sponsor-badge]][sponsor])
[![TypeScript version][ts-badge]][typescript-4-5]
[![Node.js version][nodejs-badge]][nodejs]
[![APLv2][license-badge]][license]

[comment]: <> ([![Build Status - GitHub Actions][gha-badge]][gha-ci])

## Template: node-typescript-boilerplate

👩🏻💻 Developer Ready: A comprehensive template. Works out of the box for most [Node.js][nodejs] projects.


## Getting Started

This project is intended to be used with the latest Active LTS release of [Node.js][nodejs].


### Clone repository

To clone the repository, use the following commands:

```sh
git clone https://github.com/bloodred17/edifact-serializer.git
cd edifact-serializer
npm install
```

## Usage

__The following example demonstrates the creation of a Segment definition:__

```ts
export const interchangeTrailerSegment = new EdifactSegment({
  name: 'interchange_trailer',
  tag: 'UNZ',
  elements: [
    // Elements and Compund Element definition
  ],
});
```

- **name** : Identifier
- **tag** : Valid Segment tag
- **elements** : List of Element and Composite Element definitions

__The following example demonstrates the creation of a single EDIFACT message Element:__

```ts
const interchangeControlCount = new EdifactElement({
  name: 'interchange_control_count',
  tag: '0036',
  status: UseStatus.M,
  _format: 'n..6'
})
```

- **name** : Identifier
- **tag** : String
- **status** : Enum that specifies if the value Mandatory or Conditional
- **_format** : Edifact specified format for values 

__The following example demonstrates the creation of a EDIFACT Composite message element:__

```ts
const documentMesageIdentification = new EdifactCompositeElement({
  name: 'document_message_identification',
  tag: 'C106',
  status: UseStatus.C,
  elements: [
    // Single message elements
  ]
})

```

- **name** : Identifier
- **tag** : String
- **status** : Enum that specifies if the value Mandatory or Conditional
- **elements**: List of Element definitions

__The following example demonstrates a CUSDEC BGM segment definition:__
```ts
import { EdifactCompositeElement, EdifactElement, EdifactSegment, UseStatus } from 'edifact-serializer';

export const beginningOfMessageSegment = new EdifactSegment({
  name: 'beginning_of_message',
  tag: 'BGM',
  counter: '0020',
  number: 3,
  level: 0,
  elements: [
    new EdifactCompositeElement({
      name: 'document_message_name',
      tag: 'C002',
      status: UseStatus.C,
      elements: [
        new EdifactElement({
          name: 'document_message_name_coded',
          tag: '1001',
          status: UseStatus.C,
          _format: 'an..3'
        }),
        new EdifactElement({
          name: 'code_list_qualifier',
          tag: '1131',
          status: UseStatus.C,
          _format: 'an..3'
        }),
        new EdifactElement({
          name: 'code_list_responsible_agency',
          tag: '3055',
          status: UseStatus.C,
          _format: 'an..3'
        }),
        new EdifactElement({
          name: 'document_message_name',
          tag: '1000',
          status: UseStatus.C,
          _format: 'an..3'
        }),
      ],
    }),
    new EdifactCompositeElement({
      name: 'document_message_identification',
      tag: 'C106',
      status: UseStatus.C,
      elements: [
        new EdifactElement({
          name: 'document_message_number',
          tag: '1004',
          status: UseStatus.C,
          _format: 'an..35'
        }),
        new EdifactElement({
          name: 'version',
          tag: '1056',
          status: UseStatus.C,
          _format: 'an..9'
        }),
        new EdifactElement({
          name: 'revision_number',
          tag: '1060',
          status: UseStatus.C,
          _format: 'an..6',
        }),
      ]
    }),
    new EdifactElement({
      name: 'message_function_coded',
      tag: '1225',
      status: UseStatus.C,
      _format: 'an..3'
    }),
  ],
});

```

__Using the serializer:__
```ts
const interchangeHeaderData = {
  syntax_identifier: 'UNOB',
  syntax_version_number: '4',
  interchange_sender_identification: '12345678ABC',
  interchange_code_qualifier: '',
  interchange_sender_internal_identification: 'ABCDEFGHIJKLMNOP',
  interchange_sender_internal_sub_identification: 'SPCAS2',
  interchange_recipient_identification: 'SARSDEC',
  date_of_preparation: '20190501',
  time_of_preparation: '1327',
  interchange_control_reference: '1234567890',
  recipient_reference_password: '',
  application_reference: 'CUSDEC',
  processing_priority_code: '',
  acknowledgement_request: '1',
  interchange_agreement_identifier: '',
  test_indicator: '1'
};

const messageHeaderData = {
  message_reference_number: '00000000155033',
  message_type_identifier: 'CUSDEC',
  message_type_version_number: 'D',
  message_type_release_number: '96B',
  controlling_agency: 'UN',
  association_assigned_code: 'ZZZ01',
};

const beginningOfMessageData = {
  document_message_name_coded: '929',
  code_list_qualifier: '',
  code_list_responsible_agency: '',
  document_message_name: 'RCD',
  document_message_number: '12345678ABC20190228654321',
  version: '012345',
  revision_number: '00001',
  message_function_coded: '9'
};

const interchangeMessage = await renderInterchangeMessage([
  { segment: unbSegment, data: interchangeHeaderData },
  { segment: unhSegment, data: messageHeaderData },
  { segment: beginningOfMessageSegment, data: beginningOfMessageData },
  //...other segments following...
]);
```
**renderInterchangeMessageRenders EDIFACT message for a segment()** function accepts array of type Message and outputs serialized data.

**Message** is an interface of segment {EdifactSegment} and data {any}

**data** is a map of edifact element identifier (name) and value. Refer to the example of '*beginningOfMessageData*' and '*beginningOfMessageSegment*' above.

## Additional functions

**renderSegment** Renders EDIFACT message for a input segment and data.

**validateValue**  Validates the value based on the EdifactElement definition.

**getElementFormat** Parses the EDIFACT data format string to useful values that can be used to validate the value

These functions are subject to change. Refer to the internal JSDoc definition for usage.

## Features

The definitions are validated using the [class-validator](https://www.npmjs.com/package/class-validator) package
and the data is validated on the basis of the specified format (specified using the *_format* property).

## Bugs and Issue reporting

Add new issues [here](https://github.com/bloodred17/edifact-serializer/issues).

[comment]: <> (## Backers & Sponsors)

[comment]: <> (Support this project by becoming a [sponsor][sponsor].)

## License

Licensed under the APLv2. See the [LICENSE](https://github.com/bloodred17/edifact-serializer/blob/main/LICENSE) file for details.

[ts-badge]: https://img.shields.io/badge/TypeScript-4.5-blue.svg
[nodejs-badge]: https://img.shields.io/badge/Node.js->=%2016.13-blue.svg
[nodejs]: https://nodejs.org/dist/latest-v14.x/docs/api/
[gha-badge]: https://github.com/jsynowiec/node-typescript-boilerplate/actions/workflows/nodejs.yml/badge.svg
[gha-ci]: https://github.com/jsynowiec/node-typescript-boilerplate/actions/workflows/nodejs.yml
[typescript]: https://www.typescriptlang.org/
[typescript-4-5]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html
[license-badge]: https://img.shields.io/badge/license-APLv2-blue.svg
[license]: https://github.com/jsynowiec/node-typescript-boilerplate/blob/main/LICENSE
[sponsor-badge]: https://img.shields.io/badge/♥-Sponsor-fc0fb5.svg
[sponsor]: https://github.com/sponsors/bloodred17
[jest]: https://facebook.github.io/jest/
[eslint]: https://github.com/eslint/eslint
[wiki-js-tests]: https://github.com/jsynowiec/node-typescript-boilerplate/wiki/Unit-tests-in-plain-JavaScript
[prettier]: https://prettier.io
[volta]: https://volta.sh
[volta-getting-started]: https://docs.volta.sh/guide/getting-started
[volta-tomdale]: https://twitter.com/tomdale/status/1162017336699838467?s=20
[gh-actions]: https://github.com/features/actions
[repo-template-action]: https://github.com/jsynowiec/node-typescript-boilerplate/generate

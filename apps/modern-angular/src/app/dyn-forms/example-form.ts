import type { DynamicFormGroup } from '@flens-dev/tools/dynamic-forms';

export const exampleForm: DynamicFormGroup = {
  type: 'GROUP',
  key: '',
  items: [
    {
      type: 'TEXT',
      key: 'firstName',
      label: 'First name',
      validators: {
        required: true,
      },
    },
    {
      type: 'TEXT',
      key: 'lastName',
      label: 'Last name',
    },
    {
      type: 'NUMBER',
      key: 'yearOfBirth',
      label: 'Year of birth',
    },
    {
      type: 'GROUP',
      key: 'address',
      items: [
        {
          type: 'ROW',
          gap: '1em',
          items: [
            {
              item: {
                type: 'TEXT',
                key: 'street',
                label: 'Street',
              },
              flex: '1 1 auto',
            },
            {
              item: {
                type: 'TEXT',
                key: 'houseNumber',
                label: 'House number',
              },
              flex: '0 1 auto',
            },
          ],
        },
        {
          type: 'TEXT',
          key: 'zipCode',
          label: 'Zip code',
        },
        {
          type: 'TEXT',
          key: 'city',
          label: 'City',
        },
      ],
    },
  ],
};

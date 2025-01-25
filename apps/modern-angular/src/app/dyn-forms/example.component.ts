import { Component, computed, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { fromOutputToObservable } from '@flens-dev/tools/common';
import type { DynamicFormGroup } from '@flens-dev/tools/dynamic-forms';
import { DynamicFormComponent } from '@flens-dev/tools/dynamic-forms';

@Component({
  selector: 'app-dyn-forms-example',
  imports: [DynamicFormComponent],
  template: `<h2>Example Dynamic Form</h2>
    <fest-dynamic-form [form]="form()">
      <button type="submit">submit</button>
    </fest-dynamic-form>`,
})
export class ExampleComponent {
  protected readonly form = computed(
    (): DynamicFormGroup => ({
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
    }),
  );

  protected readonly dynamicForm = viewChild.required(DynamicFormComponent);

  readonly #formEvents = fromOutputToObservable(
    this.dynamicForm,
    (c) => c.formEvents,
  );

  constructor() {
    this.#formEvents.pipe(takeUntilDestroyed()).subscribe({
      next: (formEvent) => {
        console.log(formEvent);
      },
    });
  }
}

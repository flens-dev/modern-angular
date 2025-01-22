import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import type {
  DynamicFormField,
  DynamicFormGroup,
  DynamicFormItem,
  DynamicFormItemContainer,
  DynamicFormRow,
} from './model';
import {
  isDynamicFormField,
  isDynamicFormGroup,
  isDynamicFormRow,
} from './model';
import { DynamicFormFieldComponent } from './dynamic-form-field';
import { DynamicFormGroupComponent } from './dynamic-form-group';

@Component({
  selector: 'fest-dynamic-form-item-container',
  imports: [
    ReactiveFormsModule,
    DynamicFormFieldComponent,
    DynamicFormGroupComponent,
  ],
  template: `@for (item of itemContainer().children; track $index) {
    @if (isGroup(item)) {
      <fest-dynamic-form-group [group]="item" />
    } @else if (isField(item)) {
      <fest-dynamic-form-field [field]="item" />
    } @else if (isRow(item)) {
      TODO: ROW
    } @else {
      {{ assertNever(item) }}
    }
  }`,
})
export class DynamicFormItemContainerComponent {
  readonly itemContainer = input.required<DynamicFormItemContainer>();

  protected isField(item: DynamicFormItem): item is DynamicFormField {
    return isDynamicFormField(item);
  }

  protected isGroup(item: DynamicFormItem): item is DynamicFormGroup {
    return isDynamicFormGroup(item);
  }

  protected isRow(item: DynamicFormItem): item is DynamicFormRow {
    return isDynamicFormRow(item);
  }

  protected assertNever(item: never) {
    console.error(`item should be never, but is ${item}`);
  }
}

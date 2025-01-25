import { Component, forwardRef, input } from '@angular/core';

import type {
  DynamicFormField,
  DynamicFormGroup,
  DynamicFormItem,
  DynamicFormRow,
} from '../domain/model';
import {
  isDynamicFormField,
  isDynamicFormGroup,
  isDynamicFormRow,
} from '../domain/model';
import { DynamicFormFieldComponent } from './dynamic-form-field';
import { DynamicFormGroupComponent } from './dynamic-form-group';
import { DynamicFormRowComponent } from './dynamic-form-row';

@Component({
  selector: 'fest-dynamic-form-item',
  imports: [
    DynamicFormFieldComponent,
    forwardRef(() => DynamicFormGroupComponent),
    DynamicFormRowComponent,
  ],
  template: `@let itm = item();
    @if (isGroup(itm)) {
      <fest-dynamic-form-group [group]="itm" />
    } @else if (isField(itm)) {
      <fest-dynamic-form-field [field]="itm" />
    } @else if (isRow(itm)) {
      <fest-dynamic-form-row [row]="itm" />
    } @else {
      {{ assertNever(itm) }}
    } `,
})
export class DynamicFormItemComponent {
  readonly item = input.required<DynamicFormItem>();

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

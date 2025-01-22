import { Component, input } from '@angular/core';

import type {
  DynamicFormField,
  DynamicFormGroup,
  DynamicFormItem,
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
  selector: 'fest-dynamic-form-item',
  imports: [DynamicFormFieldComponent, DynamicFormGroupComponent],
  template: `@let itm = item();
    @if (isGroup(itm)) {
      <fest-dynamic-form-group [group]="itm" />
    } @else if (isField(itm)) {
      <fest-dynamic-form-field [field]="itm" />
    } @else if (isRow(itm)) {
      TODO: ROW
      @for (rowItem of itm.children; track $index) {
        <fest-dynamic-form-item [item]="rowItem.child" />
      }
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

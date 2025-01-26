import { Component, forwardRef, input } from '@angular/core';

import type {
  DynamicFormField,
  DynamicFormGroup,
  DynamicFormItem,
} from '../domain/model';
import { isDynamicFormField, isDynamicFormGroup } from '../domain/model';
import { DynamicFormFieldComponent } from './dynamic-form-field';
import { DynamicFormGroupComponent } from './dynamic-form-group';

@Component({
  selector: 'fest-dynamic-form-item',
  imports: [
    DynamicFormFieldComponent,
    forwardRef(() => DynamicFormGroupComponent),
  ],
  template: `@let itm = item();
    @if (isGroup(itm)) {
      <fest-dynamic-form-group [group]="itm" />
    } @else if (isField(itm)) {
      <fest-dynamic-form-field [field]="itm" />
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

  protected assertNever(item: never) {
    console.error(`item should be never, but is ${item}`);
  }
}

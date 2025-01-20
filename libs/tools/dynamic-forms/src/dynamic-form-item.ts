import { Component, input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';

import {
  DynamicFormItem,
  isDynamicFormField,
  isDynamicFormGroup,
} from './model';
import {
  DynamicFormGroupComponent,
  DynamicFormGroupComponentInput,
} from './dynamic-form-group';
import {
  DynamicFormFieldComponentInput,
  DynamicFormFieldComponent,
} from './dynamic-form-field';

export type DynamicFormItemComponentInput = Readonly<{
  dynamicControl: DynamicFormItem;
  reactiveControl: AbstractControl | null;
}>;

@Component({
  selector: 'fest-dynamic-form-item',
  imports: [
    ReactiveFormsModule,
    DynamicFormFieldComponent,
    DynamicFormGroupComponent,
  ],
  template: `<div>
    @let itm = item();
    @if (isGroup(itm)) {
      <fest-dynamic-form-group [group]="itm" />
    } @else if (isField(itm)) {
      <fest-dynamic-form-field [field]="itm" />
    } @else {
      Unhandled type: {{ itm.dynamicControl.type }}
    }
  </div>`,
})
export class DynamicFormItemComponent {
  readonly item = input.required<DynamicFormItemComponentInput>();

  protected isField(
    item: DynamicFormItemComponentInput,
  ): item is DynamicFormFieldComponentInput {
    return isDynamicFormField(item.dynamicControl);
  }

  protected isGroup(
    item: DynamicFormItemComponentInput,
  ): item is DynamicFormGroupComponentInput {
    return isDynamicFormGroup(item.dynamicControl);
  }
}

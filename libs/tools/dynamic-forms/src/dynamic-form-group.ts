import { Component, inject, input } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

import {
  DynamicFormField,
  DynamicFormGroup,
  DynamicFormItem,
  DynamicFormRow,
  isDynamicFormField,
  isDynamicFormGroup,
  isDynamicFormRow,
} from './model';
import { DynamicFormFieldComponent } from './dynamic-form-field';

@Component({
  selector: 'fest-dynamic-form-group',
  imports: [ReactiveFormsModule, DynamicFormFieldComponent],
  template: `@let grp = group();
    <div [formGroup]="parentFormGroup">
      Group {{ grp.key }}
      <div [formGroupName]="grp.key">
        @for (item of grp.children; track $index) {
          @if (isGroup(item)) {
            <fest-dynamic-form-group [group]="item" />
          } @else if (isField(item)) {
            <fest-dynamic-form-field [field]="item" />
          } @else if (isRow(item)) {
            TODO: ROW
          } @else {
            {{ assertNever(item) }}
          }
        }
      </div>
    </div>`,
})
export class DynamicFormGroupComponent {
  protected readonly parentControl = inject(ControlContainer, {
    skipSelf: true,
  });
  protected readonly parentFormGroup = this.parentControl.control as FormGroup;

  readonly group = input.required<DynamicFormGroup>();

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

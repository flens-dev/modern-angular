import { Component, forwardRef, inject, input } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

import type { DynamicFormRow } from './model';
import { DynamicFormItemComponent } from './dynamic-form-item';

@Component({
  selector: 'fest-dynamic-form-row',
  imports: [ReactiveFormsModule, forwardRef(() => DynamicFormItemComponent)],
  template: `@let rw = row();
    <div
      [formGroup]="parentFormGroup"
      style="display: flex; flex-direction: row"
      [style.gap]="rw.gap"
    >
      @for (rowItem of rw.items; track $index) {
        <fest-dynamic-form-item
          [item]="rowItem.item"
          [style.flex]="rowItem.flex"
        />
      }
    </div>`,
})
export class DynamicFormRowComponent {
  protected readonly parentControl = inject(ControlContainer, {
    skipSelf: true,
  });
  protected readonly parentFormGroup = this.parentControl.control as FormGroup;

  readonly row = input.required<DynamicFormRow>();
}

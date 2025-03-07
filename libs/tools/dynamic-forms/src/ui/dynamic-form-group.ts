import { Component, forwardRef, inject, input } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

import type { DynamicFormGroup } from '../domain/model';
import { DynamicFormItemContainerComponent } from './dynamic-form-item-container';

@Component({
  selector: 'fest-dynamic-form-group',
  imports: [
    ReactiveFormsModule,
    forwardRef(() => DynamicFormItemContainerComponent),
  ],
  template: `@let grp = group();
    <div [formGroup]="parentFormGroup">
      <div [formGroupName]="grp.key">
        <fest-dynamic-form-item-container [itemContainer]="grp" />
      </div>
    </div>`,
})
export class DynamicFormGroupComponent {
  protected readonly parentControl = inject(ControlContainer, {
    skipSelf: true,
  });
  protected readonly parentFormGroup = this.parentControl.control as FormGroup;

  readonly group = input.required<DynamicFormGroup>();
}

import { Component, computed, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { DynamicFormGroup } from './model';
import { createFormGroup } from './create-form-group';
import {
  DynamicFormGroupComponent,
  DynamicFormGroupComponentInput,
} from './dynamic-form-group';

@Component({
  selector: 'fest-dynamic-form',
  imports: [ReactiveFormsModule, DynamicFormGroupComponent],
  template: `<form [formGroup]="formGroup()">
    <fest-dynamic-form-group [group]="group()" />
    <ng-content />
  </form>`,
})
export class DynamicFormComponent {
  readonly form = input.required<DynamicFormGroup>();

  readonly formGroup = computed(() => {
    const form = this.form();
    const formGroup = createFormGroup(form);
    return formGroup;
  });

  protected readonly group = computed(
    (): DynamicFormGroupComponentInput => ({
      dynamicControl: this.form(),
      reactiveControl: this.formGroup(),
    }),
  );
}

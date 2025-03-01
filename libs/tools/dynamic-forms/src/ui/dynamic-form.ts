import { Component, computed, input } from '@angular/core';
import { outputFromObservable, toObservable } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';

import { switchMap } from 'rxjs';

import type { DynamicFormGroup } from '../domain/model';
import { createFormGroup } from '../domain/create-form-group';
import { DynamicFormItemContainerComponent } from './dynamic-form-item-container';

@Component({
  selector: 'fest-dynamic-form',
  imports: [ReactiveFormsModule, DynamicFormItemContainerComponent],
  template: `<form [formGroup]="rootFormGroup()">
    <fest-dynamic-form-item-container [itemContainer]="form()" />
    <ng-content />
  </form>`,
})
export class DynamicFormComponent {
  readonly form = input.required<DynamicFormGroup>();

  protected readonly rootFormGroup = computed(() =>
    createFormGroup(this.form()),
  );

  readonly #formGroup$ = toObservable(this.rootFormGroup);

  readonly formGroup = outputFromObservable(this.#formGroup$);

  readonly formEvents = outputFromObservable(
    this.#formGroup$.pipe(switchMap((formGroup) => formGroup.events)),
  );
}

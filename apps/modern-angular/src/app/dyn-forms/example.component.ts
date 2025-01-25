import { Component, computed, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { fromOutputToObservable } from '@flens-dev/tools/common';
import { formNotValid } from '@flens-dev/tools/forms';
import { DynamicFormComponent } from '@flens-dev/tools/dynamic-forms';

import { exampleForm } from './example-form';

@Component({
  selector: 'app-dyn-forms-example',
  imports: [DynamicFormComponent],
  template: `<h2>Example Dynamic Form</h2>
    <fest-dynamic-form [form]="form">
      <button type="submit" [disabled]="submitDisabled()">submit</button>
    </fest-dynamic-form>`,
})
export class ExampleComponent {
  protected readonly form = exampleForm;

  protected readonly dynamicForm = viewChild.required(DynamicFormComponent);

  readonly #formGroup = fromOutputToObservable(
    this.dynamicForm,
    (c) => c.formGroup,
  );
  readonly #formNotValid = formNotValid(this.#formGroup);

  protected readonly submitDisabled = computed(() => {
    const notValid = this.#formNotValid();
    const submitting = false; // TODO
    return notValid || submitting;
  });

  readonly #formEvents = fromOutputToObservable(
    this.dynamicForm,
    (c) => c.formEvents,
  );

  constructor() {
    this.#formEvents.pipe(takeUntilDestroyed()).subscribe({
      next: (formEvent) => {
        console.log(formEvent);
      },
    });
  }
}

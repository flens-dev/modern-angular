import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  untracked,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { EMPTY, filter, map } from 'rxjs';

import {
  formNotValid,
  injectServiceCall,
  isBusyState,
  ServiceCallStateComponent,
  validFormSubmit,
} from '@flens-dev/tools';

import { createFooEditForm, FooId, FooService } from './model';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-foo-edit',
  imports: [ReactiveFormsModule, ServiceCallStateComponent],
  styleUrl: './foos.css',
  templateUrl: './foo-edit.component.html',
})
export class FooEditComponent {
  readonly #fooService = inject(FooService);

  protected readonly isBusyState = isBusyState;
  protected readonly editForm = createFooEditForm();

  readonly fooId = input<FooId>();

  protected readonly readFoo = injectServiceCall(
    this.fooId,
    (fooId) => (fooId == null ? EMPTY : this.#fooService.readFoo(fooId)),
    {
      behavior: 'SWITCH',
      onSuccess: (_request, response) => this.editForm.setValue(response.foo),
    },
  );

  readonly #updateFooRequest = validFormSubmit(this.editForm).pipe(
    map((foo) =>
      untracked(() => {
        const fooId = this.fooId();
        if (fooId == null) {
          return null;
        }

        return { fooId, foo };
      }),
    ),
    filter((request) => request != null),
  );

  protected readonly updateFoo = injectServiceCall(
    this.#updateFooRequest,
    ({ fooId, foo }) => this.#fooService.updateFoo(fooId, foo),
    {
      behavior: 'CONCAT',
      onBusyChange: (busy) => {
        if (busy && !this.editForm.disabled) {
          this.editForm.disable({ emitEvent: false });
        } else if (!busy && this.editForm.disabled) {
          this.editForm.enable({ emitEvent: false });
        }
      },
      onSuccess: (_request, _response) => {
        this.editForm.markAsPristine({ emitEvent: false });
      },
    },
  );

  readonly #editFormNotValid = formNotValid(this.editForm);
  readonly #readIsBusy = computed(() => this.readFoo.state().type === 'BUSY');
  readonly #updateIsBusy = computed(
    () => this.updateFoo.state().type === 'BUSY',
  );

  protected readonly submitDisabled = computed(
    () =>
      this.#readIsBusy() || this.#updateIsBusy() || this.#editFormNotValid(),
  );
}

import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  untracked,
  viewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { map } from 'rxjs';

import {
  formNotValid,
  fromEventToObservable,
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
  readonly #location = inject(Location);
  readonly #fooService = inject(FooService);

  protected readonly isBusyState = isBusyState;
  protected readonly editForm = createFooEditForm();

  readonly fooId = input.required<FooId>();

  protected readonly readFoo = injectServiceCall(
    this.fooId,
    (fooId) => this.#fooService.readFoo(fooId),
    {
      behavior: 'SWITCH',
      onSuccess: (_request, response) => this.editForm.setValue(response.foo),
    },
  );

  readonly #updateFooRequest = validFormSubmit(this.editForm).pipe(
    map((foo) => untracked(() => ({ fooId: this.fooId(), foo }))),
  );

  protected readonly updateFoo = injectServiceCall(
    this.#updateFooRequest,
    ({ fooId, foo }) => this.#fooService.updateFoo(fooId, foo),
    {
      behavior: 'CONCAT',
      onBusyChange: (busy) => this.#disableOrEnableEditFormOnBusyChange(busy),
      onSuccess: (_request, _response) => {
        this.editForm.markAsPristine({ emitEvent: false });
      },
    },
  );

  protected readonly btnDelete = viewChild('btnDelete', { read: ElementRef });
  readonly #deleteFooRequest = fromEventToObservable(
    this.btnDelete,
    'click',
  ).pipe(map(() => untracked(() => this.fooId())));

  protected readonly deleteFoo = injectServiceCall(
    this.#deleteFooRequest,
    (fooId) => this.#fooService.deleteFoo(fooId),
    {
      behavior: 'CONCAT',
      onBusyChange: (busy) => this.#disableOrEnableEditFormOnBusyChange(busy),
      onSuccess: (_request, _response) => {
        this.#location.back();
      },
    },
  );

  readonly #editFormNotValid = formNotValid(this.editForm);

  readonly #isBusy = computed(
    () => this.readFoo.busy() || this.updateFoo.busy() || this.deleteFoo.busy(),
  );

  protected readonly submitDisabled = computed(
    () => this.#editFormNotValid() || this.#isBusy(),
  );

  protected readonly deleteDisabled = computed(() => this.#isBusy());

  #disableOrEnableEditFormOnBusyChange(busy: boolean): void {
    if (busy && !this.editForm.disabled) {
      this.editForm.disable({ emitEvent: false });
    } else if (!busy && this.editForm.disabled) {
      this.editForm.enable({ emitEvent: false });
    }
  }
}

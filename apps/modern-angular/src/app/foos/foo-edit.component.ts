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
  ServiceCallStateComponent,
  validFormSubmit,
} from '@flens-dev/tools';

import {
  FOO_FORM,
  FooId,
  FooService,
  disableOrEnableFooFormOnBusyChange,
  provideFooForm,
} from './model';
import { injectDeleteFoo } from './services';
import { FooFormComponent } from './views';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-foo-edit',
  providers: [provideFooForm()],
  imports: [ReactiveFormsModule, ServiceCallStateComponent, FooFormComponent],
  styleUrl: './foos.css',
  templateUrl: './foo-edit.component.html',
})
export class FooEditComponent {
  readonly #location = inject(Location);
  readonly #fooService = inject(FooService);

  protected readonly form = inject(FOO_FORM);

  readonly fooId = input.required<FooId>();

  protected readonly readFoo = injectServiceCall(
    this.fooId,
    (fooId) => this.#fooService.readFoo(fooId),
    {
      behavior: 'SWITCH',
      onSuccess: (_request, response) => this.form.setValue(response.foo),
    },
  );

  readonly #updateFooRequest = validFormSubmit(this.form).pipe(
    map((foo) => untracked(() => ({ fooId: this.fooId(), foo }))),
  );

  protected readonly updateFoo = injectServiceCall(
    this.#updateFooRequest,
    ({ fooId, foo }) => this.#fooService.updateFoo(fooId, foo),
    {
      behavior: 'CONCAT',
      onBusyChange: (busy) =>
        disableOrEnableFooFormOnBusyChange(this.form, busy),
      onSuccess: (_request, _response) => {
        this.form.markAsPristine({ emitEvent: false });
      },
    },
  );

  protected readonly btnDelete = viewChild('btnDelete', { read: ElementRef });
  readonly #deleteFooRequest = fromEventToObservable(
    this.btnDelete,
    'click',
  ).pipe(map(() => untracked(() => this.fooId())));

  protected readonly deleteFoo = injectDeleteFoo(
    this.#deleteFooRequest,
    (_request, _response) => {
      this.#location.back();
    },
  );

  readonly #editFormNotValid = formNotValid(this.form);

  readonly #isBusy = computed(
    () => this.readFoo.busy() || this.updateFoo.busy() || this.deleteFoo.busy(),
  );

  protected readonly submitDisabled = computed(
    () => this.#editFormNotValid() || this.#isBusy(),
  );

  protected readonly deleteDisabled = computed(() => this.#isBusy());
}

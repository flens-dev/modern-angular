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
  ServiceCallStateComponent,
  validFormSubmit,
} from '@flens-dev/tools';

import { FOO_FORM, FooId, provideFooForm, ReadFoo, UpdateFoo } from './model';
import { injectDeleteFoo, injectReadFoo, injectUpdateFoo } from './services';
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

  protected readonly form = inject(FOO_FORM);

  readonly fooId = input.required<FooId>();

  readonly #readFooRequest = computed((): ReadFoo => ({ fooId: this.fooId() }));

  protected readonly readFoo = injectReadFoo({
    request: this.#readFooRequest,
    form: this.form,
  });

  readonly #updateFooRequest = validFormSubmit(this.form).pipe(
    map((foo) => untracked((): UpdateFoo => ({ fooId: this.fooId(), foo }))),
  );

  protected readonly updateFoo = injectUpdateFoo({
    request: this.#updateFooRequest,
    form: this.form,
    onSuccess: (_request, _response) => {
      this.form.markAsPristine({ emitEvent: false });
    },
  });

  protected readonly btnDelete = viewChild('btnDelete', { read: ElementRef });
  readonly #deleteFooRequest = fromEventToObservable(
    this.btnDelete,
    'click',
  ).pipe(map(() => untracked(() => this.fooId())));

  protected readonly deleteFoo = injectDeleteFoo({
    request: this.#deleteFooRequest,
    form: this.form,
    onSuccess: (_request, _response) => {
      this.#location.back();
    },
  });

  readonly #editFormNotValid = formNotValid(this.form);

  readonly #isBusy = computed(
    () => this.readFoo.busy() || this.updateFoo.busy() || this.deleteFoo.busy(),
  );

  protected readonly submitDisabled = computed(
    () => this.#editFormNotValid() || this.#isBusy(),
  );

  protected readonly deleteDisabled = computed(() => this.#isBusy());
}

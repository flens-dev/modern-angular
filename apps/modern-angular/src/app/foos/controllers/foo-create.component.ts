import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  untracked,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { map } from 'rxjs';

import {
  formNotValid,
  ServiceCallStateComponent,
  validFormSubmit,
} from '@flens-dev/tools';

import { CreateFoo, FOO_FORM, provideFooForm } from '../model';
import { injectCreateFoo } from '../services';
import { FooFormComponent } from '../views';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-foo-create',
  providers: [provideFooForm()],
  imports: [ReactiveFormsModule, ServiceCallStateComponent, FooFormComponent],
  templateUrl: './foo-create.component.html',
})
export class FooCreateComponent {
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);

  protected readonly form = inject(FOO_FORM);

  readonly #createFooRequest = validFormSubmit(this.form).pipe(
    map((foo) => untracked((): CreateFoo => ({ foo }))),
  );

  protected readonly createFoo = injectCreateFoo({
    request: this.#createFooRequest,
    form: this.form,
    onSuccess: (_request, response) => {
      // NOTE Or this.#location.back()?
      this.#router.navigate(
        ['..', encodeURIComponent(response.fooId), 'update'],
        {
          relativeTo: this.#route,
          replaceUrl: true,
        },
      );
    },
  });

  readonly #formNotValid = formNotValid(this.form);

  protected readonly submitDisabled = computed(
    () => this.#formNotValid() || this.createFoo.busy(),
  );
}

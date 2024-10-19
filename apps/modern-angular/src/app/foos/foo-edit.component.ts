import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import { EMPTY } from 'rxjs';

import { ErrorPipe, injectServiceCall } from '@flens-dev/tools';

import { createFooEditForm, FooId, FooService } from './model';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-foo-edit',
  imports: [ReactiveFormsModule, ErrorPipe],
  styleUrl: './foos.css',
  styles: `
    .form: {
      display: grid;
      grid-template-columns: auto 1fr;
      grid-template-rows: auto auto auto;
    }
  `,
  templateUrl: './foo-edit.component.html',
})
export class FooEditComponent {
  readonly #fooService = inject(FooService);

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
}

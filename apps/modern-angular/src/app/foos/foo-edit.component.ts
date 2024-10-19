import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import { EMPTY, filter } from 'rxjs';

import { ErrorPipe, injectServiceCall } from '@flens-dev/tools';

import { createFooEditForm, FooId, FooService } from './model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
    },
  );

  constructor() {
    this.readFoo.stateChanges
      .pipe(
        filter((state) => state.type === 'SUCCESS'),
        takeUntilDestroyed(),
      )
      .subscribe({
        next: (state) => {
          this.editForm.setValue(state.response.foo);
        },
      });
  }
}

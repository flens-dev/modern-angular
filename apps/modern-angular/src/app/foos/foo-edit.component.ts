import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import { EMPTY } from 'rxjs';

import {
  injectServiceCall,
  isBusyState,
  ServiceCallStateComponent,
} from '@flens-dev/tools';

import { createFooEditForm, FooId, FooService } from './model';
import { ReactiveFormsModule } from '@angular/forms';

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
}

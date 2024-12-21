import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ServiceCallStateComponent } from '@flens-dev/tools';

import { CREATE_FOO_SERVICE, provideCreateFoo } from '../services';
import { FooFormComponent } from '../views';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-create-foo',
  providers: [provideCreateFoo()],
  imports: [ReactiveFormsModule, ServiceCallStateComponent, FooFormComponent],
  templateUrl: './create-foo.component.html',
})
export class CreateFooComponent {
  protected readonly createFoo = inject(CREATE_FOO_SERVICE);
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ServiceCallStateComponent } from '@flens-dev/tools';

import { CREATE_FOO_SERVICE, provideCreateFoo } from '../services';
import { FooFormComponent } from '../views';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-foo-create',
  providers: [provideCreateFoo()],
  imports: [ReactiveFormsModule, ServiceCallStateComponent, FooFormComponent],
  templateUrl: './foo-create.component.html',
})
export class FooCreateComponent {
  protected readonly createFoo = inject(CREATE_FOO_SERVICE);
}

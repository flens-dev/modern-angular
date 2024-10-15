import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideFooInMemoryRepository } from './infrastructure';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-foo',
  providers: [provideFooInMemoryRepository()],
  template: `TODO FOO`,
})
export class FooComponent {}

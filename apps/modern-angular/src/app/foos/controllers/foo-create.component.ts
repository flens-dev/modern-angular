import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-foo-create',
  templateUrl: './foo-create.component.html',
})
export class FooCreateComponent {}

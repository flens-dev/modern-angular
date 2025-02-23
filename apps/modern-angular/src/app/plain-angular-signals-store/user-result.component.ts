import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DummyjsonUser } from '../dummyjson';

@Component({
  selector: 'app-user-result',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div>
    {{ user().firstName }} {{ user().lastName }} (aka {{ user().username }})
  </div>`,
})
export class UserResultComponent {
  readonly user = input.required<DummyjsonUser>();
}

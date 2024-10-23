import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { FooFormGroup } from '../model';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-foo-form',
  imports: [ReactiveFormsModule],
  styles: `
    .form {
      display: grid;
      grid-template-columns: auto 1fr;
      grid-template-rows: auto auto;
      gap: 0.5em;
    }
  `,
  template: `<div [formGroup]="form()" class="form">
    <label for="name" style="grid-column: 1 / 2; grid-row: 1 / 2">Name</label>
    <input
      data-testid="name-input"
      id="name"
      type="text"
      formControlName="name"
      style="grid-column: 2 / 3; grid-row: 1 / 2"
    />

    <label for="count" style="grid-column: 1 / 2; grid-row: 2 / 3">
      Count
    </label>
    <input
      data-testid="count-input"
      id="count"
      type="number"
      formControlName="count"
      style="grid-column: 2 / 3; grid-row: 2 / 3"
    />
  </div>`,
})
export class FooFormComponent {
  readonly form = input.required<FooFormGroup>();
}

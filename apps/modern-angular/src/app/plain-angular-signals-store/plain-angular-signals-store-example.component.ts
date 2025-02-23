import { ChangeDetectionStrategy, Component } from '@angular/core';
import { injectStore } from './store';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-plain-angular-signals-store-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  template: `<h2>Plain Angular Signals Store</h2>`,
})
export class PlainAngularSignalsStoreExampleComponent {
  protected readonly store = injectStore();
}

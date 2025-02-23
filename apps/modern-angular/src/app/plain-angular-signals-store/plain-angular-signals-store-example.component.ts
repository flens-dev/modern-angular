import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { injectPlainAngularSignalsStore, UsersSearchFormGroup } from './store';
import { UserResultComponent } from './user-result.component';

@Component({
  selector: 'app-plain-angular-signals-store-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    UserResultComponent,
  ],
  template: `<h2>Plain Angular Signals Store</h2>

    <form [formGroup]="usersSearchForm">
      <mat-form-field>
        <mat-label>Search for users</mat-label>
        <input type="text" matInput formControlName="q" />
        <button type="submit" matSuffix mat-icon-button>
          @if (usersIsLoading()) {
            <mat-spinner diameter="24" strokeWidth="3" />
          } @else {
            <mat-icon>search</mat-icon>
          }
        </button>
      </mat-form-field>
    </form>

    @let users = usersValue();
    @if (users !== undefined) {
      @if (users.users.length > 0) {
        <h3>
          Results
          <button type="button" mat-icon-button (click)="reloadUsers()">
            <mat-icon>refresh</mat-icon>
          </button>
        </h3>
        @for (user of users.users; track user.id) {
          <app-user-result [user]="user" />
        }
      } @else {
        <div>No users found</div>
      }
    }`,
})
export class PlainAngularSignalsStoreExampleComponent {
  protected readonly usersSearchForm: UsersSearchFormGroup = inject(
    NonNullableFormBuilder,
  ).group({
    q: [''],
  });

  readonly #store = injectPlainAngularSignalsStore(this.usersSearchForm);

  protected readonly usersIsLoading = this.#store.users.isLoading;
  protected readonly usersValue = this.#store.users.value;

  protected readonly reloadUsers = () => this.#store.users.reload();
}

import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { JsonPipe } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';

import { DummyjsonAuthSignInClient, DummyjsonClient } from '../dummyjson';

@Component({
  selector: 'app-auth-example',
  imports: [JsonPipe, MatButtonModule],
  template: `<h2>Auth Example</h2>

    <h3>User</h3>
    @if (user.isLoading()) {
      <p>Loading user...</p>
    } @else if (user.error()) {
      <p>Error: {{ user.error() | json }}</p>
    } @else {
      @let u = user.value();
      @if (u) {
        <p>
          Username: {{ u.username }}<br />
          Firstname: {{ u.firstName }}<br />
          Lastname: {{ u.lastName }}<br />
          E-Mail: {{ u.email }}
        </p>
      }
    }
    <p>
      <button type="button" mat-stroked-button (click)="user.reload()">
        Reload user
      </button>
    </p>

    <h3>Quote</h3>
    @if (quote.isLoading()) {
      <p>Loading quote...</p>
    } @else if (quote.error()) {
      <p>Error: {{ quote.error() | json }}</p>
    } @else {
      @let q = quote.value();
      @if (q) {
        <p>Quote: {{ q.quote }}</p>
        <p>By: {{ q.author }}</p>
      }
    }
    <p>
      <button type="button" mat-stroked-button (click)="quote.reload()">
        Reload quote
      </button>
    </p>

    <p>
      <button type="button" mat-stroked-button (click)="clearToken()">
        Clear token
      </button>
    </p>`,
})
export class AuthExampleComponent {
  readonly #dummyjsonAuthSignInClient = inject(DummyjsonAuthSignInClient);
  readonly #dummyjsonClient = inject(DummyjsonClient);

  protected readonly user = rxResource({
    stream: () => this.#dummyjsonClient.getMe(),
  });

  protected readonly quote = rxResource({
    stream: () => this.#dummyjsonClient.getAuthRandomQuote(),
  });

  protected clearToken() {
    this.#dummyjsonAuthSignInClient.clearToken();
  }
}

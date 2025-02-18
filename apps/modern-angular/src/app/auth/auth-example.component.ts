import { Component, inject } from '@angular/core';

import { rxResource } from '@angular/core/rxjs-interop';
import { JsonPipe } from '@angular/common';

import { DummyjsonClient } from '../dummyjson';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-auth-example',
  imports: [JsonPipe, MatButtonModule],
  template: `<h1>Auth Example</h1>

    <h2>User</h2>
    @if (user.isLoading()) {
      <p>Loading user...</p>
    } @else if (user.error()) {
      <p>Error: {{ user.error() | json }}</p>
    } @else if (user.hasValue()) {
      <p>User: {{ user.value() | json }}</p>
    }
    <p>
      <button type="button" mat-stroked-button (click)="user.reload()">
        Reload user
      </button>
    </p>

    <h2>Quote</h2>
    @if (quote.isLoading()) {
      <p>Loading quote...</p>
    } @else if (quote.error()) {
      <p>Error: {{ quote.error() | json }}</p>
    } @else if (quote.hasValue()) {
      @let q = quote.value();
      <p>Quote: {{ q?.quote }}</p>
      <p>By: {{ q?.author }}</p>
    }
    <p>
      <button type="button" mat-stroked-button (click)="quote.reload()">
        Reload quote
      </button>
    </p>

    <p>Auth-State: {{ authState() }}</p>
    <p>
      <button type="button" mat-stroked-button (click)="clearToken()">
        Clear token
      </button>
    </p>`,
})
export class AuthExampleComponent {
  readonly #dummyjsonClient = inject(DummyjsonClient);

  protected readonly authState = this.#dummyjsonClient.state;

  protected readonly user = rxResource({
    loader: () => this.#dummyjsonClient.getMe(),
  });

  protected readonly quote = rxResource({
    loader: () => this.#dummyjsonClient.getRandomQuote(),
  });

  protected clearToken() {
    this.#dummyjsonClient.clearToken();
  }
}

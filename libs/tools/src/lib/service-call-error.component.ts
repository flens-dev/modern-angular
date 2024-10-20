import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ErrorPipe } from './error.pipe';
import { ServiceCallStateError } from './inject-service-call';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'fest-service-call-error',
  imports: [ErrorPipe],
  styles: `
    .error {
      color: var(--fest-color-error, red);
      font-weight: bold;
    }
  `,
  template: `<div class="error">{{ error().error | error }}</div>`,
})
export class ServiceCallErrorComponent<TRequest> {
  readonly error = input.required<ServiceCallStateError<TRequest>>();
}

import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  TemplateRef,
} from '@angular/core';

import { ServiceCallState } from './inject-service-call';
import { ServiceCallErrorComponent } from './service-call-error.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'fest-service-call-state',
  imports: [NgTemplateOutlet, ServiceCallErrorComponent],
  template: `@let s = state();
    @switch (s.type) {
      @case ('IDLE') {
        @if (idle(); as idleTmpl) {
          <ng-container
            *ngTemplateOutlet="idleTmpl; context: { $implicit: s }"
          />
        }
      }
      @case ('BUSY') {
        @if (busy(); as busyTmpl) {
          <ng-container
            *ngTemplateOutlet="busyTmpl; context: { $implicit: s }"
          />
        }
      }
      @case ('ERROR') {
        @if (error(); as errorTmpl) {
          <ng-container
            *ngTemplateOutlet="errorTmpl; context: { $implicit: s }"
          />
        } @else {
          <fest-service-call-error [error]="s" />
        }
      }
      @case ('SUCCESS') {
        @if (success(); as successTmpl) {
          <ng-container
            *ngTemplateOutlet="successTmpl; context: { $implicit: s }"
          />
        }
      }
    }`,
})
export class ServiceCallStateComponent<TRequest, TResponse> {
  readonly state = input.required<ServiceCallState<TRequest, TResponse>>();

  readonly idle = input<TemplateRef<unknown>>();
  readonly busy = input<TemplateRef<unknown>>();
  readonly error = input<TemplateRef<unknown>>();
  readonly success = input<TemplateRef<unknown>>();
}

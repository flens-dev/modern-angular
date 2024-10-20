import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
        @if (idleTmpl(); as idleTmpl) {
          <ng-container
            *ngTemplateOutlet="idleTmpl; context: { $implicit: s }"
          />
        } @else if (idleText()) {
          <div>{{ idleText() }}</div>
        }
      }
      @case ('BUSY') {
        @if (busyTmpl(); as busyTmpl) {
          <ng-container
            *ngTemplateOutlet="busyTmpl; context: { $implicit: s }"
          />
        } @else if (busyText()) {
          <div>{{ busyText() }}</div>
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

  readonly idle = input<TemplateRef<unknown> | string>();
  readonly busy = input<TemplateRef<unknown> | string>();
  readonly error = input<TemplateRef<unknown>>();
  readonly success = input<TemplateRef<unknown>>();

  readonly idleTmpl = computed(() => {
    const idle = this.idle();
    return idle == null || typeof idle === 'string' ? undefined : idle;
  });
  readonly idleText = computed(() => {
    const idle = this.idle();
    return idle != null && typeof idle === 'string' ? idle : undefined;
  });

  readonly busyTmpl = computed(() => {
    const busy = this.busy();
    return busy == null || typeof busy === 'string' ? undefined : busy;
  });
  readonly busyText = computed(() => {
    const busy = this.busy();
    return busy != null && typeof busy === 'string' ? busy : undefined;
  });
}

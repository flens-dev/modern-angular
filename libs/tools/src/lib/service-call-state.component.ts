import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
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
  template: `@if (state(); as state) {
    @switch (state.type) {
      @case ('IDLE') {
        @if (idleTmpl(); as idleTmpl) {
          <ng-container
            *ngTemplateOutlet="idleTmpl; context: { $implicit: state }"
          />
        } @else if (idleText()) {
          <div>{{ idleText() }}</div>
        }
      }
      @case ('BUSY') {
        @if (busyTmpl(); as busyTmpl) {
          <ng-container
            *ngTemplateOutlet="busyTmpl; context: { $implicit: state }"
          />
        } @else if (busyText()) {
          <div>{{ busyText() }}</div>
        }
      }
      @case ('ERROR') {
        @if (error(); as errorTmpl) {
          <ng-container
            *ngTemplateOutlet="errorTmpl; context: { $implicit: state }"
          />
        } @else {
          <fest-service-call-error [error]="state" />
        }
      }
      @case ('SUCCESS') {
        @if (successTmpl(); as successTmpl) {
          <ng-container
            *ngTemplateOutlet="successTmpl; context: { $implicit: state }"
          />
        }
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

  protected readonly idleTmpl = computed(() => {
    const idle = this.idle();
    return idle == null || typeof idle === 'string' ? undefined : idle;
  });
  protected readonly idleText = computed(() => {
    const idle = this.idle();
    return idle != null && typeof idle === 'string' ? idle : undefined;
  });

  protected readonly busyTmpl = computed(() => {
    const busy = this.busy();
    return busy == null || typeof busy === 'string' ? undefined : busy;
  });
  protected readonly busyText = computed(() => {
    const busy = this.busy();
    return busy != null && typeof busy === 'string' ? busy : undefined;
  });

  protected readonly successFromContent = contentChild('success', {
    read: TemplateRef,
  });
  protected readonly successTmpl = computed(() => {
    const success = this.success();
    if (success != null) {
      return success;
    }

    return this.successFromContent();
  });
}

import { computed, DestroyRef, Signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  Observable,
  NEVER,
  Subject,
  catchError,
  concatMap,
  filter,
  from,
  map,
  merge,
  of,
  share,
  startWith,
  switchMap,
  takeUntil,
  distinctUntilChanged,
} from 'rxjs';
import { sourceToObservable, ValueSource } from './value-source';

export type ServiceCallFn<TRequest, TResponse> = (
  request: TRequest,
) => Observable<TResponse>;

export type ServiceCallStateIdle = {
  readonly type: 'IDLE';
};

export type ServiceCallStateBusy<TRequest> = {
  readonly type: 'BUSY';
  readonly request: TRequest;
};

export type ServiceCallStateError<TRequest> = {
  readonly type: 'ERROR';
  readonly request: TRequest;
  readonly error: unknown;
};

export type ServiceCallStateSuccess<TRequest, TResponse> = {
  readonly type: 'SUCCESS';
  readonly request: TRequest;
  readonly response: TResponse;
};

export type ServiceCallState<TRequest, TResponse> =
  | ServiceCallStateIdle
  | ServiceCallStateBusy<TRequest>
  | ServiceCallStateError<TRequest>
  | ServiceCallStateSuccess<TRequest, TResponse>;

const idleServiceCallState: ServiceCallStateIdle = {
  type: 'IDLE',
};

const busyServiceCallState = <TRequest>(
  request: TRequest,
): ServiceCallStateBusy<TRequest> => ({
  type: 'BUSY',
  request,
});

const errorServiceCallState = <TRequest>(
  request: TRequest,
  error: unknown,
): ServiceCallStateError<TRequest> => ({
  type: 'ERROR',
  request,
  error,
});

const successServiceCallState = <TRequest, TResponse>(
  request: TRequest,
  response: TResponse,
): ServiceCallStateSuccess<TRequest, TResponse> => ({
  type: 'SUCCESS',
  request,
  response,
});

export const isIdleState = <TRequest, TResponse>(
  state: ServiceCallState<TRequest, TResponse>,
): state is ServiceCallStateIdle => {
  return state != null && state.type === 'IDLE';
};

export const isBusyState = <TRequest, TResponse>(
  state: ServiceCallState<TRequest, TResponse>,
): state is ServiceCallStateBusy<TRequest> => {
  return state != null && state.type === 'BUSY';
};

export const isErrorState = <TRequest, TResponse>(
  state: ServiceCallState<TRequest, TResponse>,
): state is ServiceCallStateError<TRequest> => {
  return state != null && state.type === 'ERROR';
};

export const isSuccessState = <TRequest, TResponse>(
  state: ServiceCallState<TRequest, TResponse>,
): state is ServiceCallStateSuccess<TRequest, TResponse> => {
  return state != null && state.type === 'SUCCESS';
};

export type ServiceCall<TRequest, TResponse> = {
  readonly state: Signal<ServiceCallState<TRequest, TResponse>>;
  readonly stateChanges: Observable<ServiceCallState<TRequest, TResponse>>;
  readonly busy: Signal<boolean>;
  readonly reset: () => void;
};

export type ServiceCallOptions<TRequest, TResponse> = {
  readonly behavior: 'SWITCH' | 'CONCAT';
  readonly destroyRef?: DestroyRef;
  readonly resetOn?: Observable<unknown>;
  readonly autoResetOnSuccess?: boolean;
  readonly onBusyChange?: (busy: boolean) => void;
  readonly onSuccess?: (
    request: TRequest,
    response: TResponse,
  ) => Promise<void> | void;
};

const defaultServiceCallOptions: ServiceCallOptions<unknown, unknown> = {
  behavior: 'SWITCH',
  destroyRef: undefined,
  resetOn: undefined,
  autoResetOnSuccess: undefined,
  onBusyChange: undefined,
  onSuccess: undefined,
};

const setupServiceCall = <TRequest, TResponse>(
  $request$: ValueSource<TRequest>,
  serviceFn: ServiceCallFn<TRequest, TResponse>,
  options: ServiceCallOptions<TRequest, TResponse>,
): Observable<ServiceCallState<TRequest, TResponse>> => {
  const request$ = sourceToObservable($request$);
  const mapFn = options.behavior === 'CONCAT' ? concatMap : switchMap;

  const reset$ =
    options.resetOn == null
      ? NEVER
      : options.resetOn.pipe(map(() => idleServiceCallState));

  return merge(
    request$.pipe(
      mapFn((request) =>
        serviceFn(request).pipe(
          switchMap((response) => {
            const success: ServiceCallState<TRequest, TResponse>[] = [
              successServiceCallState(request, response),
            ];
            if (options.autoResetOnSuccess) {
              success.push(idleServiceCallState);
            }
            return from(success);
          }),
          catchError((error) => of(errorServiceCallState(request, error))),
          startWith(busyServiceCallState(request)),
          takeUntil(reset$),
        ),
      ),
    ),
    reset$,
  ).pipe(takeUntilDestroyed(options.destroyRef), share());
};

/**
 * Executes the `serviceFn` whenever a new request is emitted.
 * Depending on the behavior specified in the options the preceding call may be cancelled.
 *
 * Starting at "IDLE" the state transitions to "BUSY" as soon as a request is emitted.
 * If the service call succeeds the state switches to "SUCCESS", if an error occures it will be "ERROR".
 *
 * With the returned `reset()` function or provided `resetOn` observable the service call can be cancelled and reset to "IDLE".
 * With `autoResetOnSuccess` enabled, every "SUCCESS" state is immediately followed by an "IDLE" state.
 * This may be usefull on service calls where the response is not needed, but just the execution of the call.
 *
 * `injectServiceCall` is intended to be called inside an injection context.
 */
export const injectServiceCall = <TRequest, TResponse>(
  $request$: ValueSource<TRequest>,
  serviceFn: ServiceCallFn<TRequest, TResponse>,
  options?: ServiceCallOptions<TRequest, TResponse>,
): ServiceCall<TRequest, TResponse> => {
  const reset$ = new Subject<void>();
  const resetOn =
    options?.resetOn == null
      ? reset$.asObservable()
      : merge(options.resetOn, reset$.asObservable());

  options = {
    ...defaultServiceCallOptions,
    ...options,
    resetOn,
  };

  const state$ = setupServiceCall($request$, serviceFn, options);

  const onBusyChange = options.onBusyChange;
  if (onBusyChange != null) {
    state$
      .pipe(
        map((state) => state.type === 'BUSY'),
        distinctUntilChanged(),
      )
      .subscribe({
        next: (busy) => onBusyChange(busy),
      });
  }

  const onSuccess = options.onSuccess;
  if (onSuccess != null) {
    state$.pipe(filter((state) => state.type === 'SUCCESS')).subscribe({
      next: (state) => onSuccess(state.request, state.response),
    });
  }

  const state = toSignal(state$, {
    initialValue: idleServiceCallState,
  });

  const busy = computed(() => state().type === 'BUSY');

  return {
    state,
    stateChanges: state$,
    busy,
    reset: () => {
      reset$.next();
    },
  };
};

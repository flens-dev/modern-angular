import { DestroyRef, untracked } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NEVER, Observable, Subject, from, of, startWith } from 'rxjs';

import { streamAggregateResource } from './stream-aggregate-resource';

describe('streamAggregateResource', () => {
  it('should have the initialValue before the first request', () => {
    const initialValue: readonly string[] = [];

    const resource = streamAggregateResource({
      initialValue,
      request: NEVER,
      loader: (request) => of(`response to ${request}`),
      aggregate: (acc, current) => [...acc, current],
      destroyRef: TestBed.inject(DestroyRef),
    });

    expect(untracked(resource.status)).toEqual('idle');
    expect(untracked(resource.hasValue)).toBeTruthy();
    expect(untracked(resource.value)).toEqual(initialValue);
  });

  it('should be in loading state while loader processes request', () => {
    const expectedRequest = 'request';
    const initialValue: readonly string[] = [];

    const resource = streamAggregateResource({
      initialValue,
      request: of(expectedRequest),
      loader: (actualRequest): Observable<string> => {
        expect(actualRequest).toEqual(expectedRequest);
        return NEVER;
      },
      aggregate: (acc, current) => [...acc, current],
      destroyRef: TestBed.inject(DestroyRef),
    });

    expect(untracked(resource.status)).toEqual('loading');
    expect(untracked(resource.hasValue)).toBeTruthy();
    expect(untracked(resource.value)).toEqual(initialValue);
  });

  it('should be in resolved state after loader returned response', () => {
    const expectedRequest = 'request';
    const expectedResponse = 'response';
    const initialValue: readonly string[] = [];

    const request$ = NEVER.pipe(startWith(expectedRequest));

    const resource = streamAggregateResource({
      initialValue,
      request: request$,
      loader: (actualRequest): Observable<string> => {
        expect(actualRequest).toEqual(expectedRequest);
        return of(expectedResponse);
      },
      aggregate: (acc, current) => [...acc, current],
      destroyRef: TestBed.inject(DestroyRef),
    });

    expect(untracked(resource.status)).toEqual('resolved');
    expect(untracked(resource.hasValue)).toBeTruthy();
    expect(untracked(resource.value)).toEqual([expectedResponse]);
  });

  it('should aggregate all values returned by the loader', () => {
    const expectedRequest = 'request';
    const expectedResponses = ['response 1', 'response 2', 'response 3'];
    const initialValue: readonly string[] = [];

    const request$ = NEVER.pipe(startWith(expectedRequest));

    const resource = streamAggregateResource({
      initialValue,
      request: request$,
      loader: (actualRequest): Observable<string> => {
        expect(actualRequest).toEqual(expectedRequest);
        return from(expectedResponses);
      },
      aggregate: (acc, current) => [...acc, current],
      destroyRef: TestBed.inject(DestroyRef),
    });

    expect(untracked(resource.status)).toEqual('resolved');
    expect(untracked(resource.hasValue)).toBeTruthy();
    expect(untracked(resource.value)).toEqual(expectedResponses);
  });

  it('should be in error state when loader throws', () => {
    const expectedRequest = 'request';
    const initialValue: readonly string[] = [];
    const error = 'error';

    const request$ = NEVER.pipe(startWith(expectedRequest));

    const resource = streamAggregateResource({
      initialValue,
      request: request$,
      loader: (actualRequest): Observable<string> => {
        expect(actualRequest).toEqual(expectedRequest);
        throw error;
      },
      aggregate: (acc, current) => [...acc, current],
      destroyRef: TestBed.inject(DestroyRef),
    });

    expect(untracked(resource.status)).toEqual('error');
    expect(untracked(resource.hasValue)).toBeTruthy();
    expect(untracked(resource.value)).toEqual(initialValue);
    expect(untracked(resource.error)?.message).toEqual(
      `Unknown error: ${error}`,
    );
  });

  it('should be in idle state without error when the request is undefined', () => {
    const request = new Subject<string | null | undefined>();
    const expectedRequest = 'request';
    const expectedResponse = 'response';
    const initialValue: readonly string[] = [];
    const error = 'error';

    const resource = streamAggregateResource({
      initialValue,
      request,
      loader: (actualRequest): Observable<string> => {
        if (actualRequest === null) {
          throw error;
        }

        expect(actualRequest).toEqual(expectedRequest);
        return of(expectedResponse);
      },
      aggregate: (acc, current) => [...acc, current],
      destroyRef: TestBed.inject(DestroyRef),
    });

    request.next(expectedRequest);

    expect(untracked(resource.status)).toEqual('resolved');
    expect(untracked(resource.hasValue)).toBeTruthy();
    expect(untracked(resource.value)).toEqual([expectedResponse]);

    request.next(null);

    expect(untracked(resource.status)).toEqual('error');
    expect(untracked(resource.hasValue)).toBeTruthy();
    expect(untracked(resource.value)).toEqual([expectedResponse]);
    expect(untracked(resource.error)?.message).toEqual(
      `Unknown error: ${error}`,
    );

    request.next(undefined);

    expect(untracked(resource.status)).toEqual('idle');
    expect(untracked(resource.hasValue)).toBeTruthy();
    expect(untracked(resource.value)).toEqual([expectedResponse]);
    expect(untracked(resource.error)).toBeUndefined();
  });
});

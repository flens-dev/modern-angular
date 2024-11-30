import { DestroyRef, untracked } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { NEVER, Observable, from, of } from 'rxjs';

import {
  ResourceStatus,
  streamAggregateResource,
} from './stream-aggregate-resource';

describe('streamAggreateResource', () => {
  it('should have the initialValue before the first request', () => {
    const initialValue: readonly string[] = [];

    const resource = streamAggregateResource({
      initialValue,
      request: NEVER,
      loader: (request) => of(`response to ${request}`),
      aggregate: (acc, current) => [...acc, current],
      destroyRef: TestBed.inject(DestroyRef),
    });

    expect(untracked(resource.status)).toEqual(ResourceStatus.Idle);
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

    expect(untracked(resource.status)).toEqual(ResourceStatus.Loading);
    expect(untracked(resource.hasValue)).toBeTruthy();
    expect(untracked(resource.value)).toEqual(initialValue);
  });

  it('should be in resolved state after loader returned response', () => {
    const expectedRequest = 'request';
    const expectedResponse = 'response';
    const initialValue: readonly string[] = [];

    const resource = streamAggregateResource({
      initialValue,
      request: of(expectedRequest),
      loader: (actualRequest): Observable<string> => {
        expect(actualRequest).toEqual(expectedRequest);
        return of(expectedResponse);
      },
      aggregate: (acc, current) => [...acc, current],
      destroyRef: TestBed.inject(DestroyRef),
    });

    expect(untracked(resource.status)).toEqual(ResourceStatus.Resolved);
    expect(untracked(resource.hasValue)).toBeTruthy();
    expect(untracked(resource.value)).toEqual([expectedResponse]);
  });

  it('should aggregate all values returned by the loader', () => {
    const expectedRequest = 'request';
    const expectedResponses = ['response 1', 'response 2', 'response 3'];
    const initialValue: readonly string[] = [];

    const resource = streamAggregateResource({
      initialValue,
      request: of(expectedRequest),
      loader: (actualRequest): Observable<string> => {
        expect(actualRequest).toEqual(expectedRequest);
        return from(expectedResponses);
      },
      aggregate: (acc, current) => [...acc, current],
      destroyRef: TestBed.inject(DestroyRef),
    });

    expect(untracked(resource.status)).toEqual(ResourceStatus.Resolved);
    expect(untracked(resource.hasValue)).toBeTruthy();
    expect(untracked(resource.value)).toEqual(expectedResponses);
  });

  it('should be in error state when loader throws', () => {
    const expectedRequest = 'request';
    const initialValue: readonly string[] = [];
    const error = new Error('error');

    const resource = streamAggregateResource({
      initialValue,
      request: of(expectedRequest),
      loader: (actualRequest): Observable<string> => {
        expect(actualRequest).toEqual(expectedRequest);
        throw error;
      },
      aggregate: (acc, current) => [...acc, current],
      destroyRef: TestBed.inject(DestroyRef),
    });

    expect(untracked(resource.status)).toEqual(ResourceStatus.Error);
    expect(untracked(resource.hasValue)).toBeTruthy();
    expect(untracked(resource.value)).toEqual(initialValue);
    expect(untracked(resource.error)).toEqual(error);
  });
});

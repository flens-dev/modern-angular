import { Location } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideLocationMocks } from '@angular/common/testing';
import {
  ChangeDetectionStrategy,
  Component,
  provideZonelessChangeDetection,
} from '@angular/core';
import { ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import {
  provideRouter,
  Router,
  RouterOutlet,
  Routes,
  withComponentInputBinding,
} from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { render, screen } from '@testing-library/angular';
import '@testing-library/jest-dom';
import { userEvent } from '@testing-library/user-event';

import type { Foo, FooCreated } from '../public';

import {
  provideFooHttpRepository,
  provideLocationBackOnFooCreated,
  provideNavigateToUpdateOnFooCreated,
} from '../infrastructure';
import type { FooRoutes } from '../public';

import { CreateFooComponent } from './create-foo.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-noop',
  template: '',
})
export class NoopComponent {}

const testFooRoutes: FooRoutes = [
  {
    path: 'create',
    component: CreateFooComponent,
  },
  {
    path: ':fooId/update',
    component: NoopComponent,
  },
  {
    path: '',
    component: NoopComponent,
  },
];

const testRoutes: Routes = [
  {
    path: 'foos',
    children: testFooRoutes,
  },
];

const testProviders = () => [
  provideZonelessChangeDetection(),
  { provide: ComponentFixtureAutoDetect, useValue: true },
  provideRouter(testRoutes, withComponentInputBinding()),
  provideLocationMocks(),
  provideHttpClient(),
  provideHttpClientTesting(),
  provideFooHttpRepository(),
];

const enterFoo = async (foo: Foo) => {
  const nameInput = screen.getByTestId('name-input');
  expect(nameInput).toBeInTheDocument();
  const countInput = screen.getByTestId('count-input');
  expect(countInput).toBeInTheDocument();
  await userEvent.click(nameInput);
  await userEvent.keyboard(foo.name);
  await userEvent.click(countInput);
  await userEvent.keyboard(`${foo.count}`);
};

const expectFooCreated = (
  http: HttpTestingController,
  foo: Foo,
  fooCreated: FooCreated,
) => {
  const createFooRequest = http.expectOne(
    {
      method: 'POST',
      url: '/api/foos',
    },
    'create foo',
  );
  expect(createFooRequest.request.body).toEqual(foo);
  createFooRequest.flush(fooCreated);
};

describe('FooCreateComponent', () => {
  it(`
    GIVEN a 'create foo' component
    WHEN not providing valid data
    THEN the submit button should be disabled`, async () => {
    await render(CreateFooComponent, {
      providers: [testProviders()],
    });

    const submitButton = screen.getByTestId('submit');
    expect(submitButton).toBeDisabled();
  });

  it(`
    GIVEN a 'create foo' component
    WHEN entering valid data
    THEN the submit button should be enabled`, async () => {
    await render(CreateFooComponent, {
      providers: [testProviders()],
    });

    const submitButton = screen.getByTestId('submit');

    const nameInput = screen.getByTestId('name-input');
    await userEvent.click(nameInput);
    await userEvent.keyboard('Test');

    expect(submitButton).toBeEnabled();
  });

  it(`
    GIVEN a 'navigate to update' configuration
    WHEN creating a foo
    THEN the app should navigate to the 'update foo' route with the id of the created foo`, async () => {
    const foo: Foo = {
      name: 'Test',
      count: 4,
    };
    const fooCreated: FooCreated = {
      fooId: '1',
      foo,
    };

    const renderResult = await render('<router-outlet />', {
      providers: [testProviders(), provideNavigateToUpdateOnFooCreated()],
      imports: [RouterOutlet],
    });

    const routerHarness = await RouterTestingHarness.create('/foos');
    const http = renderResult.debugElement.injector.get(HttpTestingController);
    const router = renderResult.debugElement.injector.get(Router);

    expect(router.url).toEqual('/foos');
    await routerHarness.navigateByUrl('/foos/create');
    expect(router.url).toEqual('/foos/create');

    const submitButton = screen.getByTestId('submit');
    expect(submitButton).toBeDisabled();

    await enterFoo(foo);

    expect(submitButton).toBeEnabled();
    await userEvent.click(submitButton);

    expectFooCreated(http, foo, fooCreated);
    await routerHarness.fixture.whenStable();

    expect(router.url).toEqual('/foos/1/update');

    http.verify();
  });

  it(`
    GIVEN a 'navigate back' configuration
    WHEN creating a foo
    THEN the app should navigate to the previous route`, async () => {
    const foo: Foo = {
      name: 'Test',
      count: 4,
    };
    const fooCreated: FooCreated = {
      fooId: '1',
      foo,
    };

    const renderResult = await render('<router-outlet />', {
      providers: [testProviders(), provideLocationBackOnFooCreated()],
      imports: [RouterOutlet],
    });

    const routerHarness = await RouterTestingHarness.create('/foos');
    const http = renderResult.debugElement.injector.get(HttpTestingController);
    const location = TestBed.inject(Location);

    expect(location.path()).toEqual('/foos');
    await routerHarness.navigateByUrl('/foos/create');
    expect(location.path()).toEqual('/foos/create');

    const submitButton = screen.getByTestId('submit');
    expect(submitButton).toBeDisabled();

    await enterFoo(foo);

    expect(submitButton).toBeEnabled();
    await userEvent.click(submitButton);

    expectFooCreated(http, foo, fooCreated);
    await routerHarness.fixture.whenStable();

    expect(location.path()).toEqual('/foos');

    http.verify();
  });
});

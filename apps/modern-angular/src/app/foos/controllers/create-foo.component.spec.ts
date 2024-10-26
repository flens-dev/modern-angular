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
  provideExperimentalZonelessChangeDetection,
  Provider,
} from '@angular/core';
import { ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
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

import type { Foo, FooCreated } from '../model';

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

const byTestId = (testid: string) => By.css(`[data-testid="${testid}"]`);

const testProviders = () => [
  provideExperimentalZonelessChangeDetection(),
  { provide: ComponentFixtureAutoDetect, useValue: true },
  provideRouter(testRoutes, withComponentInputBinding()),
  provideLocationMocks(),
  provideHttpClient(),
  provideHttpClientTesting(),
  provideFooHttpRepository(),
];

const configureTestBed = (additionalProviders: Provider[] = []) => {
  return TestBed.configureTestingModule({
    teardown: {
      destroyAfterEach: true,
    },
    providers: [testProviders(), additionalProviders],
    imports: [CreateFooComponent, NoopComponent],
  }).compileComponents();
};

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

describe('FooCreateComponent with UPDATE', () => {
  beforeEach(async () => {
    await configureTestBed(provideNavigateToUpdateOnFooCreated());
  });

  it('should submit CreateFoo with given input and navigate to :fooId/update', async () => {
    const routerHarness = await RouterTestingHarness.create('/foos/create');

    const http = TestBed.inject(HttpTestingController);
    const router = TestBed.inject(Router);

    const foo: Foo = {
      name: 'Test',
      count: 4,
    };
    const fooCreated: FooCreated = {
      fooId: '1',
      foo,
    };

    await enterFoo(foo);

    const btnSubmit = routerHarness.fixture.debugElement.query(
      byTestId('submit'),
    );

    btnSubmit.nativeElement.click();

    expectFooCreated(http, foo, fooCreated);

    await routerHarness.fixture.whenStable();

    expect(router.url).toEqual('/foos/1/update');

    http.verify();
  });
});

describe('FooCreateComponent with BACK', () => {
  beforeEach(async () => {
    await configureTestBed(provideLocationBackOnFooCreated());
  });

  it('should submit CreateFoo with given input and navigate back to first route', async () => {
    const routerHarness = await RouterTestingHarness.create('/foos');
    const http = TestBed.inject(HttpTestingController);
    const location = TestBed.inject(Location);

    expect(location.path()).toEqual('/foos');
    await routerHarness.navigateByUrl('/foos/create');
    expect(location.path()).toEqual('/foos/create');

    const foo: Foo = {
      name: 'Test',
      count: 4,
    };
    const fooCreated: FooCreated = {
      fooId: '1',
      foo,
    };

    await enterFoo(foo);

    const btnSubmit = routerHarness.fixture.debugElement.query(
      byTestId('submit'),
    );

    btnSubmit.nativeElement.click();

    expectFooCreated(http, foo, fooCreated);

    await routerHarness.fixture.whenStable();

    expect(location.path()).toEqual('/foos');

    http.verify();
  });
});

describe('FooCreateComponent', () => {
  it('should have a disabled submit button', async () => {
    await render(CreateFooComponent, {
      providers: [testProviders()],
    });

    const submitButton = screen.getByTestId('submit');
    expect(submitButton).toBeDisabled();
  });

  it('should have an enabled submit button when input is valid', async () => {
    await render(CreateFooComponent, {
      providers: [testProviders()],
    });

    const submitButton = screen.getByTestId('submit');

    const nameInput = screen.getByTestId('name-input');
    await userEvent.click(nameInput);
    await userEvent.keyboard('Test');

    expect(submitButton).toBeEnabled();
  });

  it('should submit CreateFoo with given input and navigate to :fooId/update', async () => {
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
});

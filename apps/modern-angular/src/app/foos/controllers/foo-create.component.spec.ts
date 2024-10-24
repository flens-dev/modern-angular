import { Location } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  provideRouter,
  Router,
  RouterOutlet,
  withComponentInputBinding,
} from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { render, screen } from '@testing-library/angular';
import '@testing-library/jest-dom';
import { userEvent } from '@testing-library/user-event';

import { provideFooHttpRepository } from '../infrastructure';
import { Foo, FooCreated } from '../model';
import {
  CreateFooServiceConfig,
  provideCreateFooServiceConfig,
} from '../services';
import { FooChildRoutes } from '../foos.routes';

import { FooCreateComponent } from './foo-create.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-noop',
  template: '',
})
export class NoopComponent {}

const testRoutes: FooChildRoutes = [
  {
    path: 'create',
    component: FooCreateComponent,
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

const byTestId = (testid: string) => By.css(`[data-testid="${testid}"]`);

const testProviders = (config?: CreateFooServiceConfig) => [
  { provide: ComponentFixtureAutoDetect, useValue: true },
  provideRouter(testRoutes, withComponentInputBinding()),
  provideLocationMocks(),
  provideHttpClient(),
  provideHttpClientTesting(),
  provideFooHttpRepository(),
  provideCreateFooServiceConfig(config),
];

const configureTestBed = (config?: CreateFooServiceConfig) => {
  return TestBed.configureTestingModule({
    teardown: {
      destroyAfterEach: true,
    },
    providers: testProviders(config),
    imports: [FooCreateComponent, NoopComponent],
  }).compileComponents();
};

describe('FooCreateComponent', () => {
  let fixture: ComponentFixture<FooCreateComponent>;

  beforeEach(async () => {
    await configureTestBed();
    fixture = TestBed.createComponent(FooCreateComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeDefined();
  });

  it('should have a disabled submit button', () => {
    const btnSubmit = fixture.debugElement.query(byTestId('submit'));

    expect(btnSubmit.nativeElement.disabled).toBeTruthy();
  });

  it('should have an enabled submit button when input is valid', () => {
    const inputName = fixture.debugElement.query(byTestId('name-input'));
    inputName.nativeElement.value = 'Test';
    inputName.nativeElement.dispatchEvent(new Event('input'));

    const btnSubmit = fixture.debugElement.query(byTestId('submit'));

    expect(btnSubmit.nativeElement.disabled).toBeFalsy();
  });
});

const enterFoo = async <T>(rootFixture: ComponentFixture<T>, foo: Foo) => {
  const inputName = rootFixture.debugElement.query(byTestId('name-input'));
  inputName.nativeElement.value = foo.name;
  inputName.nativeElement.dispatchEvent(new Event('input'));

  const countName = rootFixture.debugElement.query(byTestId('count-input'));
  countName.nativeElement.value = foo.count;
  countName.nativeElement.dispatchEvent(new Event('input'));

  await rootFixture.whenStable();
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
    await configureTestBed({ onSuccess: 'UPDATE' });
  });

  it('should submit CreateFoo with given input and navigate to :fooId/update', async () => {
    const routerHarness = await RouterTestingHarness.create('/create');

    const http = TestBed.inject(HttpTestingController);
    const location = TestBed.inject(Location);

    const foo: Foo = {
      name: 'Test',
      count: 4,
    };
    const fooCreated: FooCreated = {
      fooId: '1',
      foo,
    };

    await enterFoo(routerHarness.fixture, foo);

    const btnSubmit = routerHarness.fixture.debugElement.query(
      byTestId('submit'),
    );

    btnSubmit.nativeElement.click();

    expectFooCreated(http, foo, fooCreated);

    await routerHarness.fixture.whenStable();

    expect(location.path()).toEqual('/1/update');

    http.verify();
  });
});

describe('FooCreateComponent with BACK', () => {
  beforeEach(async () => {
    await configureTestBed({ onSuccess: 'BACK' });
  });

  it('should submit CreateFoo with given input and navigate back to first route', async () => {
    const routerHarness = await RouterTestingHarness.create('/');
    const http = TestBed.inject(HttpTestingController);
    const location = TestBed.inject(Location);

    expect(location.path()).toEqual('/');
    await routerHarness.navigateByUrl('/create');
    expect(location.path()).toEqual('/create');

    const foo: Foo = {
      name: 'Test',
      count: 4,
    };
    const fooCreated: FooCreated = {
      fooId: '1',
      foo,
    };

    await enterFoo(routerHarness.fixture, foo);

    const btnSubmit = routerHarness.fixture.debugElement.query(
      byTestId('submit'),
    );

    btnSubmit.nativeElement.click();

    expectFooCreated(http, foo, fooCreated);

    await routerHarness.fixture.whenStable();

    expect(location.path()).toEqual('/');

    http.verify();
  });
});

describe('FooCreateComponent with Testing Library', () => {
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
      providers: testProviders({ onSuccess: 'UPDATE' }),
      imports: [RouterOutlet],
    });

    const routerHarness = await RouterTestingHarness.create('/');
    const http = renderResult.debugElement.injector.get(HttpTestingController);
    const router = renderResult.debugElement.injector.get(Router);

    expect(router.url).toEqual('/');
    await routerHarness.navigateByUrl('/create');
    expect(router.url).toEqual('/create');

    const submitButton = screen.getByTestId('submit');
    expect(submitButton).toBeDisabled();

    const nameInput = screen.getByTestId('name-input');
    expect(nameInput).toBeInTheDocument();
    const countInput = screen.getByTestId('count-input');
    expect(countInput).toBeInTheDocument();
    await userEvent.click(nameInput);
    await userEvent.keyboard(foo.name);
    await userEvent.click(countInput);
    await userEvent.keyboard(`${foo.count}`);

    expect(submitButton).toBeEnabled();
    await userEvent.click(submitButton);

    expectFooCreated(http, foo, fooCreated);
    await routerHarness.fixture.whenStable();

    expect(router.url).toEqual('/1/update');

    http.verify();
  });
});

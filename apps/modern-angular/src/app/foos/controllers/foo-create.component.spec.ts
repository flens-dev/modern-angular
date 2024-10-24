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
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

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

const configureTestBed = (config?: CreateFooServiceConfig) => {
  return TestBed.configureTestingModule({
    teardown: {
      destroyAfterEach: true,
    },
    providers: [
      { provide: ComponentFixtureAutoDetect, useValue: true },
      provideRouter(testRoutes, withComponentInputBinding()),
      provideLocationMocks(),
      provideHttpClient(),
      provideHttpClientTesting(),
      provideFooHttpRepository(),
      provideCreateFooServiceConfig(config),
    ],
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

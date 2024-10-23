import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  provideRouter,
  Router,
  withComponentInputBinding,
} from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { provideFooHttpRepository } from '../infrastructure';
import { Foo, FooCreated } from '../model';
import {
  CreateFooServiceConfig,
  provideCreateFooServiceConfig,
} from '../services';
import { FOO_CHILDREN_ROUTES } from '../foos.routes';

import { FooCreateComponent } from './foo-create.component';
import { FooUpdateComponent } from './foo-update.component';

const configureTestBed = (config: CreateFooServiceConfig) => {
  return TestBed.configureTestingModule({
    teardown: {
      destroyAfterEach: true,
    },
    providers: [
      { provide: ComponentFixtureAutoDetect, useValue: true },
      provideRouter(FOO_CHILDREN_ROUTES, withComponentInputBinding()),
      provideHttpClient(),
      provideHttpClientTesting(),
      provideFooHttpRepository(),
      provideCreateFooServiceConfig(config),
    ],
    imports: [FooCreateComponent, FooUpdateComponent],
  }).compileComponents();
};

describe('FooCreateComponent', () => {
  let fixture: ComponentFixture<FooCreateComponent>;

  beforeEach(async () => {
    await configureTestBed({ onSuccess: 'UPDATE' });
    fixture = TestBed.createComponent(FooCreateComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeDefined();
  });

  it('should have a disabled submit button', () => {
    const btnSubmit = fixture.debugElement.query(
      By.css('[data-testid="submit"]'),
    );

    expect(btnSubmit.nativeElement.disabled).toBeTruthy();
  });

  it('should have an enabled submit button when input is valid', () => {
    const inputName = fixture.debugElement.query(
      By.css('[data-testid="name-input"]'),
    );
    inputName.nativeElement.value = 'Test';
    inputName.nativeElement.dispatchEvent(new Event('input'));

    const btnSubmit = fixture.debugElement.query(
      By.css('[data-testid="submit"]'),
    );

    expect(btnSubmit.nativeElement.disabled).toBeFalsy();
  });
});

describe('FooCreateComponent with UPDATE', () => {
  beforeEach(async () => {
    await configureTestBed({ onSuccess: 'UPDATE' });
  });

  it('should submit CreateFoo with given input and navigate to :fooId/update', async () => {
    const routerHarness = await RouterTestingHarness.create('/create');

    const http = TestBed.inject(HttpTestingController);
    const router = TestBed.inject(Router);

    const foo: Foo = {
      name: 'Test',
      count: 4,
    };

    const inputName = routerHarness.fixture.debugElement.query(
      By.css('[data-testid="name-input"]'),
    );
    inputName.nativeElement.value = foo.name;
    inputName.nativeElement.dispatchEvent(new Event('input'));

    const countName = routerHarness.fixture.debugElement.query(
      By.css('[data-testid="count-input"]'),
    );
    countName.nativeElement.value = foo.count;
    countName.nativeElement.dispatchEvent(new Event('input'));

    await routerHarness.fixture.whenStable();

    const btnSubmit = routerHarness.fixture.debugElement.query(
      By.css('[data-testid="submit"]'),
    );

    btnSubmit.nativeElement.click();

    const createFooRequest = http.expectOne(
      {
        method: 'POST',
        url: '/api/foos',
      },
      'create foo',
    );
    expect(createFooRequest.request.body).toEqual(foo);
    const fooCreatedResponse: FooCreated = {
      fooId: '1',
      foo: createFooRequest.request.body,
    };
    createFooRequest.flush(fooCreatedResponse);

    await routerHarness.fixture.whenStable();

    expect(router.url).toEqual('/1/update');

    http.expectOne(
      {
        method: 'GET',
        url: '/api/foos/1',
      },
      'read foo',
    );

    http.verify();
  });
});

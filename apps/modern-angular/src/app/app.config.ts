import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import {
  authSignInInterceptor,
  provideMaterialDialogAuthSignIn,
} from '@flens-dev/tools/auth';

import { DummyjsonClient } from './dummyjson';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authSignInInterceptor])),
    provideMaterialDialogAuthSignIn(DummyjsonClient),
  ],
};

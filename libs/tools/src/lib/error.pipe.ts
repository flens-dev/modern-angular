import { HttpErrorResponse } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';

export const errorToString = (error: unknown): string | null => {
  if (error == null || error === false) {
    return null;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (error instanceof HttpErrorResponse) {
    let e = error.error;
    try {
      e = JSON.parse(error.error);
    } catch {
      // ignore
    }
    const ret = errorToString(e);
    return ret == null ? error.message : ret;
  }

  try {
    return JSON.stringify(error);
  } catch {
    console.error(error);
    return 'unexpected error';
  }
};

@Pipe({
  standalone: true,
  pure: true,
  name: 'error',
})
export class ErrorPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]) {
    return errorToString(value);
  }
}

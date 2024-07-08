import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

export type TypicalResponse = {
  readonly id: string;
  readonly title: string;
};

@Injectable({
  providedIn: 'root',
})
export class AppTypicalService {
  getTypical(id: string): Observable<TypicalResponse> {
    const response: TypicalResponse = {
      id,
      title: 'Some Title',
    };
    return of(response).pipe(delay(500));
  }
}

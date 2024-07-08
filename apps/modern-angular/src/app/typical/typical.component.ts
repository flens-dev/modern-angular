import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppTypicalService, TypicalResponse } from './typical.service';
import { Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-typical',
  templateUrl: './typical.component.html',
})
export class AppTypicalComponent {
  data$: Observable<TypicalResponse>;

  constructor(route: ActivatedRoute, typicalService: AppTypicalService) {
    this.data$ = route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id');
        return id == null
          ? of({
              id: '',
              title: '',
            })
          : typicalService.getTypical(id);
      })
    );
  }
}

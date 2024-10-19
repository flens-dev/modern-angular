import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  untracked,
} from '@angular/core';
import { GetFoosRequest } from './model';
import { createFoosSearchForm } from './model/foos-search.form';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-foos-search-form',
  templateUrl: './foos-search-form.component.html',
  styleUrl: './foos.css',
  imports: [ReactiveFormsModule],
})
export class FoosSearchFormComponent {
  protected readonly searchForm = createFoosSearchForm();

  readonly value = input<GetFoosRequest>();

  constructor() {
    effect(() => {
      const getFoosRequest = this.value();
      untracked(() => {
        if (getFoosRequest) {
          this.searchForm.patchValue(getFoosRequest, { emitEvent: false });
        } else {
          this.searchForm.reset(undefined, { emitEvent: false });
        }
      });
    });
  }
}

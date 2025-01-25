import { Component, input } from '@angular/core';

import type { DynamicFormItemContainer } from './model';
import { DynamicFormItemComponent } from './dynamic-form-item';

@Component({
  selector: 'fest-dynamic-form-item-container',
  imports: [DynamicFormItemComponent],
  template: `@for (item of itemContainer().items; track $index) {
    <fest-dynamic-form-item [item]="item" />
  }`,
})
export class DynamicFormItemContainerComponent {
  readonly itemContainer = input.required<DynamicFormItemContainer>();
}

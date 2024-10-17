import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';

/**
 * Mapping-Type to extract the type of the value of a control.
 * Should match the type returned by `.getRawValue()`.
 */
export type FormValueOf<T extends AbstractControl> =
  T extends FormControl<infer TControl>
    ? TControl
    : T extends FormGroup<infer TGroup>
      ? { [K in keyof TGroup]: FormValueOf<TGroup[K]> }
      : T extends FormArray<infer TElement>
        ? FormValueOf<TElement>[]
        : never;

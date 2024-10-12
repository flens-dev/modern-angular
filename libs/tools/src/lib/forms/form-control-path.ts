import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

/**
 * Strongly types the paths to nested controls of a `FormGroup`.
 *
 * Usefull for functions, which accepts a `FormGroup` and a `string`
 * which should represent a (nested) control into that `FormGroup`
 * like `AbstractControl.get('...')`.
 *
 * The names of items in a `FormArray` can be any number.
 * The actual length of the `FormArray` cannot be determined at compile time,
 * so any number is valid.
 *
 * Since `FormRecord`s are derived from `FormGroup`
 * which can hold any `string` as an control name
 * every string following the record's name is valid.
 *
 * @example
 * const fb = new FormBuilder().nonNullable;
 * const form = fb.group({
 *   some: fb.control<string>(''),
 *   other: fb.control<number>(0),
 *   nested: fb.group({
 *     prop: fb.control<string>('', {}),
 *     items: fb.array<
 *       FormGroup<{
 *         id: FormControl<string>;
 *         name: FormControl<string>;
 *       }>
 *     >([]),
 *   }),
 *   record: fb.record<
 *     FormGroup<{
 *       name: FormControl<string>;
 *     }>
 *   >({}),
 * });
 *
 * const validControlPaths: FormControlPath<typeof form>[] = [
 *   'some',
 *   'other',
 *   'nested.prop',
 *   'nested.items',
 *   'nested.items.0',
 *   'nested.items.0.id',
 *   'nested.items.1.name',
 *   'record',
 * ];
 *
 * // TypeScript shows errors like 'Type '"someOther"' is not assignable to type ...'
 * const invalidControlPaths: FormControlPath<typeof form>[] = [
 *   'someOther',
 *   'nested.items.id',
 * ];
 */
export type FormControlPath<
  TControl extends AbstractControl,
  TPrefix extends string = ''
> = TControl extends FormGroup | FormArray
  ? {
      [K in keyof TControl['controls']]: TControl['controls'][K] extends
        | FormGroup
        | FormArray
        ?
            | `${string & TPrefix}${(string | number) & K}`
            | FormControlPath<
                TControl['controls'][K],
                `${string & TPrefix}${(string | number) & K}.`
              >
        : TControl['controls'][K] extends AbstractControl
        ? `${string & TPrefix}${(string | number) & K}`
        : never;
    }[keyof TControl['controls']]
  : never;

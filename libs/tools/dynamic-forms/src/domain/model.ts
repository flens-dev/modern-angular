import type { Immutable } from '@flens-dev/tools/common';

export type WithType<T extends string> = Immutable<{
  type: T;
}>;

const isOfType = <T extends WithType<string>>(
  item: unknown,
  types: readonly string[],
): item is T => {
  return (
    item != null &&
    typeof item === 'object' &&
    ('type' satisfies keyof WithType<string>) in item &&
    typeof item.type === 'string' &&
    types.includes(item.type)
  );
};

export type WithKey = Immutable<{
  key: string;
}>;

export type WithLabel = Immutable<{
  label: string;
}>;

export type WithReadOnly = Immutable<{
  readonly?: boolean;
}>;

export type WithBaseValidators = Immutable<
  Partial<{
    required: boolean;
  }>
>;

export type WithValidators<T extends object = object> = Immutable<{
  validators?: WithBaseValidators & T;
}>;

export type DynamicFormItemContainer = Immutable<{
  items: DynamicFormItem[];
}>;

export type BaseControl<TType extends string> = WithType<TType> & WithKey;

export type BaseField<
  TType extends string,
  TValidators extends object = object,
> = Immutable<
  BaseControl<TType> & WithLabel & WithReadOnly & WithValidators<TValidators>
>;

export type DynamicFormTextField = Immutable<
  BaseField<
    'TEXT',
    Partial<{
      minLength: number;
      maxLength: number;
    }>
  >
>;

export type DynamicFormNumberField = Immutable<
  BaseField<
    'NUMBER',
    Partial<{
      min: number;
      max: number;
    }>
  >
>;

export type DynamicFormSelectFieldOption = Immutable<{
  label: string;
  value: unknown;
  disabled?: boolean;
}>;

export type DynamicFormSelectField = Immutable<
  BaseField<'SELECT'> & {
    options: DynamicFormSelectFieldOption[];
  }
>;

export type DynamicFormGroup = Immutable<
  BaseControl<'GROUP'> & DynamicFormItemContainer
>;

export type DynamicFormField =
  | DynamicFormTextField
  | DynamicFormNumberField
  | DynamicFormSelectField;

export type DynamicFormItem = DynamicFormField | DynamicFormGroup;

export const isDynamicFormGroup = (
  item: DynamicFormItem,
): item is DynamicFormGroup => {
  return isOfType<DynamicFormGroup>(item, [
    'GROUP' satisfies DynamicFormGroup['type'],
  ]);
};

type DynamicFormFieldType = DynamicFormField['type'];

const dynamicFormFieldTypesMap: Record<DynamicFormFieldType, string> = {
  NUMBER: 'number',
  SELECT: 'unknown',
  TEXT: 'string',
};

const dynamicFormFieldTypes: readonly string[] = Object.keys(
  dynamicFormFieldTypesMap,
);

export const isDynamicFormField = (
  item: DynamicFormItem,
): item is DynamicFormField => {
  return isOfType<DynamicFormField>(item, dynamicFormFieldTypes);
};

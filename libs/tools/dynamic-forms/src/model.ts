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

export type WithChildren = Immutable<{
  children: DynamicFormItem[];
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

export type DynamicFormRowItem = Immutable<{
  child: DynamicFormItem;
  width?: string;
}>;

export type DynamicFormRow = Immutable<
  WithType<'ROW'> & {
    children: DynamicFormRowItem[];
    gap?: string;
  }
>;

export type DynamicFormGroup = Immutable<BaseControl<'GROUP'> & WithChildren>;

export type DynamicFormField =
  | DynamicFormTextField
  | DynamicFormNumberField
  | DynamicFormSelectField;

export type DynamicFormControl = DynamicFormField | DynamicFormGroup;

export type DynamicFormLayout = DynamicFormRow;

export type DynamicFormItem = DynamicFormControl | DynamicFormLayout;

export const isDynamicFormGroup = (
  item: DynamicFormItem,
): item is DynamicFormGroup => {
  return isOfType<DynamicFormGroup>(item, [
    'GROUP' satisfies DynamicFormGroup['type'],
  ]);
};

export const isDynamicFormRow = (
  item: DynamicFormItem,
): item is DynamicFormRow => {
  return isOfType<DynamicFormRow>(item, [
    'ROW' satisfies DynamicFormRow['type'],
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

type DynamicFormControlType = DynamicFormControl['type'];

const dynamicFormControlTypesMap: Record<DynamicFormControlType, string> = {
  ...dynamicFormFieldTypesMap,
  GROUP: 'object',
};

const dynamicFormControlTypes: readonly string[] = Object.keys(
  dynamicFormControlTypesMap,
);

export const isDynamicFormControl = (
  item: DynamicFormItem,
): item is DynamicFormControl => {
  return isOfType<DynamicFormControl>(item, dynamicFormControlTypes);
};

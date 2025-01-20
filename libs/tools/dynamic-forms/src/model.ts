import type { Immutable } from '@flens-dev/tools/common';

export type WithType<T extends string> = Immutable<{
  type: T;
}>;

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

export type TextField = Immutable<
  BaseField<
    'TEXT',
    Partial<{
      minLength: number;
      maxLength: number;
    }>
  >
>;

export type NumberField = Immutable<
  BaseField<
    'NUMBER',
    Partial<{
      min: number;
      max: number;
    }>
  >
>;

export type SelectFieldOption = Immutable<{
  label: string;
  value: unknown;
  disabled?: boolean;
}>;

export type SelectField = Immutable<
  BaseField<'SELECT'> & {
    options: SelectFieldOption[];
  }
>;

export type RowItem = Immutable<{
  child: DynamicFormItem;
  width?: string;
}>;

export type Row = Immutable<
  WithType<'ROW'> & {
    children: RowItem[];
    gap?: string;
  }
>;

export type DynamicFormGroup = Immutable<BaseControl<'GROUP'> & WithChildren>;

export type DynamicFormField = TextField | NumberField | SelectField;

export type DynamicFormControl = DynamicFormField | DynamicFormGroup;

export type DynamicFormLayout = Row;

export type DynamicFormItem = DynamicFormControl | DynamicFormLayout;

type DynamicFormFieldType = DynamicFormField['type'];

const isOfType = <T>(item: unknown, types: readonly string[]): item is T => {
  return (
    item != null &&
    typeof item === 'object' &&
    'type' in item &&
    typeof item.type === 'string' &&
    types.includes(item.type)
  );
};

const dynamicFormFieldTypesMap: Record<DynamicFormFieldType, string> = {
  NUMBER: 'number',
  SELECT: 'unknown',
  TEXT: 'string',
};

const dynamicFormFieldTypes: readonly string[] = Object.keys(
  dynamicFormFieldTypesMap,
);

export const isDynamicFormField = (item: unknown): item is DynamicFormField => {
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
  item: unknown,
): item is DynamicFormControl => {
  return isOfType<DynamicFormControl>(item, dynamicFormControlTypes);
};

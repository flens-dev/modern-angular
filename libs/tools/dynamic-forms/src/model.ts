import type { Immutable } from '@flens-dev/tools/common';

type WithType<T extends string> = Immutable<{
  type: T;
}>;

type WithKey = Immutable<{
  key: string;
}>;

type WithLabel = Immutable<{
  label: string;
}>;

type WithReadOnly = Immutable<{
  readonly?: boolean;
}>;

type WithDisabled = Immutable<{
  disabled?: boolean;
}>;

type WithBaseValidators = Immutable<
  Partial<{
    required: boolean;
  }>
>;

type WithValidators<T extends object = object> = Immutable<{
  validators?: WithBaseValidators & T;
}>;

type BaseField<
  TType extends string,
  TValidators extends object = object,
> = Immutable<
  WithType<TType> &
    WithKey &
    WithLabel &
    WithReadOnly &
    WithDisabled &
    WithValidators<TValidators>
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
  formItem: DynamicFormItem;
  width?: string;
}>;

export type Row = Immutable<
  WithType<'ROW'> & {
    rowItems: RowItem[];
    gap?: string;
  }
>;

export type Group = Immutable<
  WithType<'GROUP'> &
    WithKey & {
      children: DynamicFormItem[];
    }
>;

export type Field = TextField | NumberField | SelectField;

export type DynamicFormItem = Field | Group | Row;

export type DynamicForm = Immutable<{
  title: string;
  formItems: DynamicFormItem[];
}>;

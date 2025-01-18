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

export type BaseControl = WithType<string>;

export type BaseField<
  TType extends string,
  TValidators extends object = object,
> = Immutable<
  BaseControl &
    WithType<TType> &
    WithKey &
    WithLabel &
    WithReadOnly &
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
  child: DynamicFormItem;
  width?: string;
}>;

export type Row = Immutable<
  WithType<'ROW'> & {
    children: RowItem[];
    gap?: string;
  }
>;

export type Group = Immutable<
  BaseControl & WithType<'GROUP'> & WithKey & WithChildren
>;

export type Field = TextField | NumberField | SelectField;

export type DynamicFormControl = Field | Group;

export type DynamicFormLayout = Row;

export type DynamicFormItem = DynamicFormControl | DynamicFormLayout;

export type DynamicFormControlType = DynamicFormControl['type'];

const dynamicFormControlTypesMap: Record<DynamicFormControlType, string> = {
  GROUP: 'object',
  NUMBER: 'number',
  SELECT: 'unknown',
  TEXT: 'string',
};

const dynamicFormControlTypes = Object.keys(dynamicFormControlTypesMap);

export const isDynamicFormControl = (
  item: unknown,
): item is DynamicFormControl => {
  return (
    item != null &&
    typeof item === 'object' &&
    'type' in item &&
    typeof item.type === 'string' &&
    dynamicFormControlTypes.includes(item.type)
  );
};

export type DynamicForm = Immutable<
  WithType<'FORM'> &
    WithChildren & {
      title: string;
    }
>;

export type DynamicFormValue = Record<string, unknown>;

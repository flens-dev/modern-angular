import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import type { MergeIntersections, Unpartial } from '@flens-dev/tools/common';

import {
  DynamicFormField,
  DynamicFormGroup,
  DynamicFormItem,
  DynamicFormItemContainer,
  DynamicFormNumberField,
  DynamicFormSelectField,
  DynamicFormTextField,
  WithType,
} from './model';

type FieldValidators = MergeIntersections<
  Unpartial<DynamicFormField['validators']>
>;

type FieldValidatorFnMap = {
  [V in keyof FieldValidators]-?: (
    v: Exclude<FieldValidators[V], undefined>,
  ) => ValidatorFn | undefined;
};

const createFieldValidatorMap: FieldValidatorFnMap = {
  max: (val: number) => Validators.max(val),
  maxLength: (val: number) => Validators.maxLength(val),
  min: (val: number) => Validators.min(val),
  minLength: (val: number) => Validators.minLength(val),
  required: (val: boolean) => (val ? Validators.required : undefined),
};

type K = keyof FieldValidatorFnMap;

const createFieldValidators = (field: DynamicFormField): ValidatorFn[] => {
  const validators: ValidatorFn[] = [];
  const fieldValidators = field.validators as Record<string, unknown>;

  if (fieldValidators) {
    Object.keys(fieldValidators).forEach((valName) => {
      const valConfig = fieldValidators[valName];
      if (valConfig) {
        const createValFn = createFieldValidatorMap[valName as K];
        const valFn = (createValFn as (v: unknown) => ValidatorFn | undefined)(
          valConfig,
        );
        if (valFn) {
          validators.push(valFn);
        }
      }
    });
  }

  return validators;
};

const addGroup = (parentGroup: FormGroup, group: DynamicFormGroup): void => {
  const formGroup = new FormGroup({});
  addItems(formGroup, group);
  parentGroup.addControl(group.key, formGroup);
};

const addNumberField = (
  parentGroup: FormGroup,
  numberField: DynamicFormNumberField,
): void => {
  const control = new FormControl<number>(0, {
    nonNullable: true,
    validators: createFieldValidators(numberField),
  });
  parentGroup.addControl(numberField.key, control);
};

const addSelectField = (
  parentGroup: FormGroup,
  selectField: DynamicFormSelectField,
): void => {
  const control = new FormControl<unknown>(null, {
    validators: createFieldValidators(selectField),
  });
  parentGroup.addControl(selectField.key, control);
};

const addTextField = (
  parentGroup: FormGroup,
  textField: DynamicFormTextField,
): void => {
  const control = new FormControl<string>('', {
    nonNullable: true,
    validators: createFieldValidators(textField),
  });
  parentGroup.addControl(textField.key, control);
};

type AddControlFn<TItem> = (parentGroup: FormGroup, item: TItem) => void;

const addControlFnMap: {
  [TType in DynamicFormItem['type']]: AddControlFn<
    Extract<DynamicFormItem, WithType<TType>>
  >;
} = {
  GROUP: addGroup,
  NUMBER: addNumberField,
  SELECT: addSelectField,
  TEXT: addTextField,
};

const addItem: AddControlFn<DynamicFormItem> = (
  parentGroup: FormGroup,
  item: DynamicFormItem,
): void => {
  const addItemFn = addControlFnMap[item.type] as AddControlFn<DynamicFormItem>;
  addItemFn(parentGroup, item);
};

const addItems = (
  parentGroup: FormGroup,
  itemContainer: DynamicFormItemContainer,
): void => {
  for (const item of itemContainer.items) {
    addItem(parentGroup, item);
  }
};

export const createFormGroup = (form: DynamicFormGroup): FormGroup => {
  const rootFormGroup = new FormGroup({});
  addItems(rootFormGroup, form);
  return rootFormGroup;
};

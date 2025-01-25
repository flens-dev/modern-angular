import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import type {
  MapDiscriminatorToType,
  MergeIntersections,
  Unpartial,
} from '@flens-dev/tools/common';

import {
  BaseControl,
  DynamicFormControl,
  DynamicFormField,
  DynamicFormGroup,
  DynamicFormItemContainer,
  DynamicFormNumberField,
  DynamicFormSelectField,
  DynamicFormTextField,
  isDynamicFormControl,
} from './model';

type DynamicFormControlTypeNameToControl = MapDiscriminatorToType<
  DynamicFormControl,
  'type'
>;

type CreateControlFn<TControl extends BaseControl<string>> = (
  control: TControl,
) => AbstractControl;

type CreateControlFnMap = {
  [TType in keyof DynamicFormControlTypeNameToControl]: CreateControlFn<
    DynamicFormControlTypeNameToControl[TType]
  >;
};

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

const createGroupControl = (group: DynamicFormGroup): FormGroup => {
  const formGroup = new FormGroup({});
  addItems(formGroup, group);
  return formGroup;
};

const createNumberFieldControl = (
  numberField: DynamicFormNumberField,
): FormControl<number> => {
  const control = new FormControl<number>(0, {
    nonNullable: true,
    validators: createFieldValidators(numberField),
  });
  return control;
};

const createSelectFieldControl = (
  selectField: DynamicFormSelectField,
): FormControl<unknown> => {
  const control = new FormControl<unknown>(null, {
    validators: createFieldValidators(selectField),
  });
  return control;
};

const createTextFieldControl = (
  textField: DynamicFormTextField,
): FormControl<string> => {
  const control = new FormControl<string>('', {
    nonNullable: true,
    validators: createFieldValidators(textField),
  });
  return control;
};

const createControlMap: CreateControlFnMap = {
  GROUP: createGroupControl,
  NUMBER: createNumberFieldControl,
  SELECT: createSelectFieldControl,
  TEXT: createTextFieldControl,
};

const addItems = (
  group: FormGroup,
  itemContainer: DynamicFormItemContainer,
): void => {
  for (const item of itemContainer.items) {
    if (isDynamicFormControl(item)) {
      const createControlFn = createControlMap[
        item.type
      ] as CreateControlFn<DynamicFormControl>;
      const control = createControlFn(item);
      group.addControl(item.key, control);
    }
  }
};

export const createFormGroup = (form: DynamicFormGroup): FormGroup => {
  return createGroupControl(form);
};

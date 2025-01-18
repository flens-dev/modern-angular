import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import type {
  MapDiscriminatedUnion,
  Merge,
  Unpartial,
} from '@flens-dev/tools/common';

import {
  BaseControl,
  DynamicForm,
  DynamicFormControl,
  Field,
  Group,
  NumberField,
  SelectField,
  TextField,
  WithChildren,
  isDynamicFormControl,
} from './model';

type DynamicFormControlTypeNameToControl = MapDiscriminatedUnion<
  DynamicFormControl,
  'type'
>;

type CreateControlFn<TControl extends BaseControl> = (
  control: TControl,
) => AbstractControl;

type CreateControlFnMap = {
  [TType in keyof DynamicFormControlTypeNameToControl]: CreateControlFn<
    DynamicFormControlTypeNameToControl[TType]
  >;
};

type FieldValidators = Merge<Unpartial<Field['validators']>>;

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

const createFieldValidators = (field: Field): ValidatorFn[] => {
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

const createGroupControl = (group: Group | DynamicForm): FormGroup => {
  const formGroup = new FormGroup({});
  addChildren(formGroup, group);
  return formGroup;
};

const createNumberFieldControl = (
  numberField: NumberField,
): FormControl<number> => {
  const control = new FormControl<number>(0, {
    nonNullable: true,
    validators: createFieldValidators(numberField),
  });
  return control;
};

const createSelectFieldControl = (
  selectField: SelectField,
): FormControl<unknown> => {
  const control = new FormControl<unknown>(null, {
    validators: createFieldValidators(selectField),
  });
  return control;
};

const createTextFieldControl = (textField: TextField): FormControl<string> => {
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

const addChildren = (group: FormGroup, withChildren: WithChildren): void => {
  for (const child of withChildren.children) {
    if (isDynamicFormControl(child)) {
      const createControlFn = createControlMap[
        child.type
      ] as CreateControlFn<DynamicFormControl>;
      const control = createControlFn(child);
      group.addControl(child.key, control);
    }
  }
};

export const createFormGroup = (dynamicForm: DynamicForm): FormGroup => {
  return createGroupControl(dynamicForm);
};

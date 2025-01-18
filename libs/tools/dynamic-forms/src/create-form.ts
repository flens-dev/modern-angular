import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

import type { MapDiscriminatedUnion } from '@flens-dev/tools/common';

import {
  BaseControl,
  DynamicForm,
  DynamicFormControl,
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

const createGroupControl = (group: Group | DynamicForm): FormGroup => {
  const formGroup = new FormGroup({});
  addChildren(formGroup, group);
  return formGroup;
};

const createNumberFieldControl = (
  numberField: NumberField,
): FormControl<number> => {
  const control = new FormControl<number>(0, { nonNullable: true });
  return control;
};

const createSelectFieldControl = (
  selectField: SelectField,
): FormControl<unknown> => {
  const control = new FormControl<unknown>(null);
  return control;
};

const createTextFieldControl = (textField: TextField): FormControl<string> => {
  const control = new FormControl<string>('', { nonNullable: true });
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

export const createDynamicForm = (dynamicForm: DynamicForm): FormGroup => {
  return createGroupControl(dynamicForm);
};

import { AbstractControl } from '@angular/forms';

type ControlName = string | number;
type ControlPath = readonly ControlName[];
const EmptyControlPath: ControlPath = [];

const controlPathToFormPath = (path: ControlPath): string => {
  return path == null || path.length === 0 ? '' : path.join('.');
};

const getControlName = (control: AbstractControl): ControlName | null => {
  if (control.parent == null) {
    return null;
  }

  const children = control.parent.controls;
  if (Array.isArray(children)) {
    for (let index = 0; index < children.length; index++) {
      if (children[index] === control) {
        return index;
      }
    }
    return null;
  }

  return (
    Object.keys(children).find((name) => control === children[name]) ?? null
  );
};

const getControlPath = (control: AbstractControl | null): ControlPath => {
  let path: ControlPath = EmptyControlPath;

  let current: AbstractControl | null = control;
  while (current != null) {
    const name = getControlName(current);
    if (name == null) {
      break;
    }

    path = [name, ...path];
    current = current.parent;
  }

  return path;
};

/**
 * Returns the path of the control from the root to itself.
 * Can be used by `.get(...)` on the root.
 */
export const getControlPathFromRoot = (
  control: AbstractControl | null,
): string => {
  return controlPathToFormPath(getControlPath(control));
};

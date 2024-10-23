import { FormGroup } from '@angular/forms';

export const disableFormOnBusy = (
  form: FormGroup,
  busy: boolean,
  opts?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
  },
): void => {
  if (busy && !form.disabled) {
    form.disable(opts);
  } else if (!busy && form.disabled) {
    form.enable(opts);
  }
};

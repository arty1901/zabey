import {AbstractControl, ValidatorFn} from '@angular/forms';

export function ChipsValidation(): ValidatorFn {

  return (control: AbstractControl): {[key: string]: string} | null => {
    const tags = control.value;

    return null;
  };
}

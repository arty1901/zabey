import {FormControl, FormGroup, FormGroupDirective, NgForm} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material';

export class ParentErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {

    const controlTouched = !!(control && (control.dirty || control.touched));
    const controlInvalid = !!(control && control.invalid);
    const parentInvalid = !!(control && control.parent && control.parent.invalid && (control.parent.dirty || control.parent.touched));

    return (controlTouched && (controlInvalid || parentInvalid));
  }
}

export class PasswordValidator {
  static areEqual(formGroup: FormGroup) {
    let value;
    let valid = true;

    for (let key in formGroup.controls) {

      if (formGroup.controls.hasOwnProperty(key)) {
        let control: FormControl = formGroup.controls[key] as FormControl;

        if (value === undefined) {
          value = control.value;
        }
        if (value !== control.value) {
          valid = false;
          break;
        }
      }
    }

    if (valid) {
      return null;
    }

    return {
      areEqual: true
    };
  }
}
// export const mustMatch: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
//
//   // const password = formGroup.get('password').value;
//   // const passwordRepeat = formGroup.get('passwordConfirm').value;
//   //
//   // return password === passwordRepeat ? null : {areEqual: true};
//
//
//
// };

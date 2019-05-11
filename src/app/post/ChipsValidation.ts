import { FormGroup, ValidationErrors } from '@angular/forms';

export class ChipsValidation {

  static validateRequired(c: FormGroup): ValidationErrors | null {

    const tags = c.get('postTags');
    return !tags ? { required: true } : null;
  }
}

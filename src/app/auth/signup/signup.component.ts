import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ParentErrorStateMatcher, PasswordValidator} from '../must-match.validator';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  form: FormGroup;
  matchingPasswordGroup: FormGroup;
  parentErrorStateMatcher = new ParentErrorStateMatcher();

  accountValidationMessages = {
    email: [
      {type: 'required', message: 'Email is required'},
      {type: 'pattern', message: 'Enter a valid email'}
    ],
    username: [
      {type: 'required', message: 'Username is required'}
    ],
    passwordConfirm: [
      {type: 'required', message: 'Confirm password is required'},
      {type: 'areEqual', message: 'Password mismatch'}
    ],
    password: [
      {type: 'required', message: 'Password is required'},
      {type: 'minlength', message: 'Password must be at least 5 characters long'},
      {type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number'}
    ]
  };

  constructor(private fb: FormBuilder,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.createForms();
  }

  createForms() {

    this.matchingPasswordGroup = new FormGroup({
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])),
      passwordConfirm: new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areEqual(formGroup);
    });

    // Creation of signUp form
    this.form = this.fb.group({

      email: ['', Validators.compose([
        Validators.email,
        Validators.required
      ])],
      username: ['', [Validators.required]],
      passwords: this.matchingPasswordGroup
    });
  }

  get Email() { return this.form.get('email'); }
  get Password() { return this.form.get('passwords.password'); }
  get Username() { return this.form.get('username'); }

  onSingup() {
    this.authService.signup(this.Email.value, this.Username.value, this.Password.value);
  }

}

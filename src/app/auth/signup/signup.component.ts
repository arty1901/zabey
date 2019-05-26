import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {mustMatch, ParentErrorStateMatcher} from '../must-match.validator';
import {ErrorStateMatcher} from '@angular/material';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  form: FormGroup;

  matchingPasswordGroup: FormGroup;
  submitted = false;
  parentErrorStateMatcher = new ParentErrorStateMatcher();

  accountValidationMessages = {
    email: [
      {type: 'required', message: 'Email is required'},
      {type: 'pattern', message: 'Enter a valid email'}
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

  constructor(private fb: FormBuilder) {
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
    }, mustMatch);

    // Creation of signUp form
    this.form = this.fb.group({

      email: ['', Validators.compose([
        Validators.email,
        Validators.required
      ])],

      passwords: this.matchingPasswordGroup
    });
  }

  onSingup() {
    this.submitted = true;
    console.log(this.form);
    console.log(this.form.get('passwords').errors);
  }

}

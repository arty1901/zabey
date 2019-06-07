import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PasswordValidator} from '../../auth/must-match.validator';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit, OnDestroy {

  userSubscription: Subscription;

  currentUser: any;

  form: FormGroup;
  matchingPasswordGroup: FormGroup;

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

  constructor(private authService: AuthService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.currentUser = this.authService.getAuthUser();
    this.userSubscription = this.authService.getAuthListner()
      .subscribe(user => {
        this.currentUser = user;
      });

    this.createForms();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  createForms() {

    this.matchingPasswordGroup = new FormGroup({

        password: new FormControl('', Validators.compose([
          Validators.minLength(6),
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
        ])),

        passwordConfirm: new FormControl('', )
      },
      (formGroup: FormGroup) => {
        return PasswordValidator.areEqual(formGroup);
      });

    // Creation of Update form
    this.form = this.fb.group({

      email: ['', Validators.compose([Validators.email])],
      username: ['',],
      passwords: this.matchingPasswordGroup
    });
  }

  onUpdate(): void {
    console.log(this.form.value);
  }

}

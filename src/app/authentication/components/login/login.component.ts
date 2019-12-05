import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
//import { ForbiddenNameValidator } from 'src/app/shared/user-name.validator';
//import { PasswordValidator } from 'src/app/shared/password.validator';
import { AuthService } from '../../store/auth.service';
import { AuthStoreService } from '../../store/auth-store.service';
import { User } from '../../models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();
  loginForm: FormGroup;
  currentUser$: Observable<User>;

  constructor(private fb: FormBuilder, private authStore: AuthStoreService, private authService: AuthService) { }

  ngOnInit() {

    debugger;
    this.authStore.initUser();
    this.currentUser$ = this.authStore.currentUser$
  
    this.loginForm = this.fb.group({
      email: ['d8hayward@gmail.com', [  Validators.required,
                            Validators.minLength(8), 
                            //ForbiddenNameValidator(/lr@vu.com/)
                          ]
                ],
      password: [''],
      name: [''],
      register: [false],
      confirmPassword: [''],
    },
    {
      //validator: PasswordValidator
    });
    
    // Subscribe to any changes on register checkbox.. for optional validation
    this.loginForm.get('register').valueChanges
      .subscribe( (isRegistering: boolean) => {
        const confirmPassword = this.loginForm.get('confirmPassword');
        if (isRegistering) {
          confirmPassword.setValidators(Validators.required);
        } else {
          confirmPassword.clearValidators();
        }
        confirmPassword.updateValueAndValidity();

      })
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  get email() {
    return this.loginForm.get('email');
  }

  get name() {
    return this.loginForm.get('name');
  }
  get password() {
    return this.loginForm.get('password');
  }

  get register() {
    return this.loginForm.get('register');
  }

  get submitTypeDesc() {
    let getterReturn = "Login"
    const register =  this.loginForm.get('register');
    if (register && !!register.value) getterReturn = "Register";
    return getterReturn;
  }

  
  onSubmit() {
    debugger;
    console.log(this.loginForm.value);
    if (!!this.register.value) {
      this.authService.signup(this.loginForm.value)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        response => console.log('Success!', response),
        error => console.error('Error!', error)
      );
    } else {
      this.authService.login(this.loginForm.value)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        response => console.log('Success!', response),
        error => console.error('Error!', error)
      );
    }

  }

}



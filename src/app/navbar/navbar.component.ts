import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Subject, Observable, throwError as observableThrowError } from 'rxjs';
import { AuthStoreService } from '../authentication/store/auth-store.service';
import { User } from '../authentication/models';
import { Router } from '@angular/router';


import { HttpClient, HttpErrorResponse } from '@angular/common/http';
//import { throwError as observableThrowError, BehaviorSubject, of } from 'rxjs';
import { catchError, tap, takeUntil } from 'rxjs/operators';
import { AuthService } from '../authentication/store/auth.service';
import { MatMenuTrigger, MatButton } from '@angular/material';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject();

  currentUser$: Observable<User>;

  // Administration dropdown menu mouse enter and leave event handling
  // https://stackoverflow.com/questions/53618333/how-to-open-and-close-angular-mat-menu-on-hover
  // requires
  private enteredButton: boolean = false;
  private isMatMenuOpen: boolean = false;
  private prevButtonTrigger: MatMenuTrigger;
  
  constructor(
    private router: Router, 
    private authStore: AuthStoreService, 
    private authService: AuthService,
    private http: HttpClient,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.currentUser$ = this.authStore.currentUser$
    //const curU = this.authStore.currentUser;
    console.log("onInit currentUser...");
    console.log(this.authStore.currentUser);
    //this.router.navigate(["/login"]);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  isAdmin() {
    return this.authStore.isAdmin();
  }

  isLoggedIn() {
    return this.authStore.isLoggedIn();
  }

  login() {
    this.router.navigate(["/login"]);
  }

  register() {
    //this.authStore.currentUser = null;
    this.router.navigate(["/login"]);
  }

  logout() {
    this.authService.logout(this.authStore.currentUser)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        response => {
          this.authStore.currentUser = null;
          this.router.navigate(["/login"]);
        },
        error => {
          this.authStore.currentUser = null;
          console.error('Error!', error);
        }
      );
  }

  // Dropdown menu custom sh
    // Administration dropdown menu mouse enter and leave event handling
  // https://stackoverflow.com/questions/53618333/how-to-open-and-close-angular-mat-menu-on-hover
  buttonEnter(trigger: MatMenuTrigger) {
    setTimeout(() => {
      if(this.prevButtonTrigger && this.prevButtonTrigger != trigger){
        this.prevButtonTrigger.closeMenu();
        this.prevButtonTrigger = trigger;
        this.isMatMenuOpen = false;
        trigger.openMenu()
      }
      else if (!this.isMatMenuOpen) {
        this.enteredButton = true;
        this.prevButtonTrigger = trigger
        trigger.openMenu()
      }
      else {
        this.enteredButton = true;
        this.prevButtonTrigger = trigger
      }
    })
  }

  buttonLeave(trigger: MatMenuTrigger, button: MatButton) {
    setTimeout(() => {
      if (this.enteredButton && !this.isMatMenuOpen) {
        trigger.closeMenu();
        this.renderer.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        this.renderer.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      } if (!this.isMatMenuOpen) {
        trigger.closeMenu();
        this.renderer.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        this.renderer.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      } else {
        this.enteredButton = false;
      }
    }, 100)
  }

  menuEnter() {
    this.isMatMenuOpen = true;
  }

  menuLeave(trigger: MatMenuTrigger, button: MatButton) {
    setTimeout(() => {
      if (!this.enteredButton) {
        this.isMatMenuOpen = false;
        trigger.closeMenu();
        this.renderer.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        this.renderer.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      } else {
        this.isMatMenuOpen = false;
      }
    }, 80)
  }






  // Testing only .....
  // ------------------------------------------------------
  testAuthentication() {
    this.testAuthRequest()
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(
      response => console.log('Success!', response),
      error => console.error('Error!', error)
    );

  }

  testAuthRequest(): Observable<any> {
    console.log("GET: /customers ...");
    return this.http
      .get("/customers")
      .pipe(
        tap(
          (customers: any) => {
            console.log("SUCCESS ", customers);
          },
          (err) => { console.log("ERROR /customers:", err); },
          () => { console.log("... DONE /customers") },
        ),
        catchError(this.handleError)
      )
    ;
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    console.error("... AuthService handleError ...");
    console.error(error);

    // Return an Observable Error with a user-facing error message
    return observableThrowError(new Error("Something bad happened. Please try again later."));
  }
  
}

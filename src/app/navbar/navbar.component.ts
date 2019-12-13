import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable, throwError as observableThrowError } from 'rxjs';
import { AuthStoreService } from '../authentication/store/auth-store.service';
import { User } from '../authentication/models';
import { Router } from '@angular/router';


import { HttpClient, HttpErrorResponse } from '@angular/common/http';
//import { throwError as observableThrowError, BehaviorSubject, of } from 'rxjs';
import { catchError, tap, takeUntil } from 'rxjs/operators';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject();

  currentUser$: Observable<User>;
  
  constructor(private router: Router, private authStore: AuthStoreService,                      private http: HttpClient ) { }

  ngOnInit() {
    debugger;
    this.currentUser$ = this.authStore.currentUser$
    //this.isAdmin = this.authStore.isAdmin();
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
    //this.authStore.currentUser = null;
    this.router.navigate(["/login"]);
  }

  register() {
    //this.authStore.currentUser = null;
  }

  logout() {
    this.authStore.currentUser = null;
  }

  testAuthentication() {


    this.testAuthRequest()
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(
      response => console.log('Success!', response),
      error => console.error('Error!', error)
    );

  }


  testAuthRequest(): Observable<any> {
    
    console.log("POST: /api/user/login ...");

    debugger;
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
    // TODO: Re-test after v5-to-v6 migration
    return observableThrowError(new Error("Something bad happened. Please try again later."));
  }
  
}

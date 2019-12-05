import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpEvent } from '@angular/common/http';
import { throwError as observableThrowError, BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

//import * as moment from 'moment';

import { User } from '../models/index';
import { AuthStoreService } from './auth-store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // "Data source" and exposed stream for isValidSession flag
  private isValidSessionSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isValidSession$: Observable<boolean> = this.isValidSessionSource.asObservable();

  /*
  // TODO: Add logic into Header component so that the Admin menu can be removed right away?
  // "Data source" and exposed stream for isAdmin flag
  private isAdminSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isAdmin$: Observable<boolean> = this.isAdminSource.asObservable();
  */

  constructor(private http: HttpClient, private authStoreService: AuthStoreService) { }

  private handleError(error: HttpErrorResponse): Observable<any> {
    console.error("... AuthService handleError ...");
    console.error(error);

    // Return an Observable Error with a user-facing error message
    // TODO: Re-test after v5-to-v6 migration
    return observableThrowError(new Error("Something bad happened. Please try again later."));
  }

  /* TODO
   * Currently the authToken is set in the token interceptor for login and "refresh" flows
   * Better to explicitly set token on login for clarity?
   */

  // Signup logic currently not in use
  // Admins create users with the resetRequired flag set to true instead
  // TODO: Remove? Leave as reference?
  signup(user: User): Observable<any> {
    console.log("POST: /user/signup ...");
    //this.authStoreService.changeState(user);
    return this.http
      .post("/auth/register", { "email": user.email, "password": user.password, "name": user.name } )
      .pipe(
        tap(
          // response example: {"user":{"email":"name@gmail.com"},"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhetc."}
          (resp: any) => {
            console.log("SUCESS /api/user/signup:", resp);
            this.authStoreService.changeState(resp.user, resp.token);
            //this.authStoreService.changeToken(resp.token);
          },
          (err) => { console.log("ERROR /api/signup:", err); },
          () => { console.log("... DONE /api/signup") }
        ),
        catchError(this.handleError)
      )
    ;
  }

    login(user: User): Observable<any> {
    
    console.log("POST: /api/user/login ...");

    debugger;
    return this.http
      .post("/auth/login", { "email": user.email, "password": user.password })
      .pipe(
        tap(
          (user: any) => {
            console.log("SUCCESS /api/user/login:", user);
            this.authStoreService.changeState(user.user, user.token);
            //this.authStoreService.changeToken(user.token);
            const blah = this.authStoreService.getState();

            // Set the current user's info
            //this.userInfo = User.fromJSON(user);
          },
          (err) => { console.log("ERROR /api/login:", err); },
          () => { console.log("... DONE /api/login") },
        ),
        catchError(this.handleError)
      )
    ;
    
    
  }


  /*
  logout(): Observable<any> {
    console.log("POST: /api/logout ...");

    // Do not clear authToken before calling /logout
    // Causes issues with the isValidSession subscription ending before we want in the header component

    return this.http
      .post("/api/logout", {})
      .pipe(
        tap(
          (resp) => { console.log("SUCCESS /api/logout:", resp); },
          (err) => { console.log("ERROR /api/logout:", err); },
          () => {
            console.log("... DONE /api/logout");

            // Clear out the current user's info
            this.userInfo = null;
          }
        ),
        catchError(this.handleError)
      )
    ;
  }

  get userInfo(): User {
    console.log("... AuthService get userInfo ...");
    let userInfo = sessionStorage.getItem("userInfo");
    return (userInfo) ? User.fromJSON(JSON.parse(userInfo)) : null;
  }
  set userInfo(user: User) {
    console.log("... AuthService set userInfo ...");

    if (user) sessionStorage.setItem("userInfo", JSON.stringify(user));
    else sessionStorage.removeItem("userInfo");

    // TODO: Use distinctUntilChanged instead of below logic?
    // (https://www.learnrxjs.io/operators/filtering/distinctuntilchanged.html)

    // Check for and send changes to subscribers of isValidSession
    let previousIsValid = this.isValidSessionSource.getValue();
    let curIsValid = this.isValidSession();
    if (previousIsValid !== curIsValid) this.isValidSessionSource.next(curIsValid);
  }

  isValidSession(): boolean {
    console.log("... AuthService.isValidSession checking session ...");
    return !!(this.userInfo);
  }

  isAdmin(): boolean {
    let userInfo = this.userInfo;

    let infoExists = !!(userInfo);
    if (!infoExists) return false;

    console.log("... AuthService.isAdmin checking roles ...");
    return userInfo.isAdmin;
  }
*/
}



import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpEvent } from '@angular/common/http';
import { throwError as observableThrowError, BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { User } from '../models/index';
import { AuthStoreService } from './auth-store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // "Data source" and exposed stream for isValidSession flag
  private isValidSessionSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isValidSession$: Observable<boolean> = this.isValidSessionSource.asObservable();
  private signupApi = "/auth/register";
  private loginApi = "/auth/login";
  private logoutApi = "/auth/logout";

  constructor(private http: HttpClient, private authStoreService: AuthStoreService) { }

  private handleError(error: HttpErrorResponse): Observable<any> {
    console.error("... AuthService handleError ...");
    console.error(error);
    return observableThrowError(new Error("Something bad happened. Please try again later."));
  }

  signup(user: User): Observable<any> {
    //this.authStoreService.changeState(user);
    return this.http
      .post(this.signupApi, { "email": user.email, "password": user.password, "name": user.name } )
      .pipe(
        tap(
          // response example: {"user":{"email":"name@gmail.com"},"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhetc."}
          (authResp: any) => {
            console.log("SUCESS /api/user/signup:", authResp);
            this.authStoreService.changeState(authResp.user, authResp.serverKey);
          },
          (err) => { console.log("ERROR /api/signup:", err); },
          () => { console.log("... DONE /api/signup") }
        ),
        catchError(this.handleError)
      )
    ;
  }

  login(user: User): Observable<any> {
    return this.http
      .post(this.loginApi, { "email": user.email, "password": user.password })
      .pipe(
        tap(
          (authResp: any) => {
            console.log("SUCCESS /auth/login:", authResp);
            this.authStoreService.changeState(authResp.user, authResp.serverKey);
          },
          (err) => { console.log("ERROR /auth/login:", err); },
          () => { console.log("... DONE /auth/login") },
        ),
        catchError(this.handleError)
      )
    ;
    
  }

  logout(user: User): Observable<any> {
    return this.http
      .post(this.logoutApi, { "email": user.email, "password": user.password })
      .pipe(
        tap(
          (authResp: any) => {
            console.log("SUCCESS /auth/logout:", authResp);
            this.authStoreService.changeState(authResp.user, authResp.serverKey);
          },
          (err) => { console.log("ERROR /auth/logout:", err); },
          () => { console.log("... DONE /auth/logout") },
        ),
        catchError(this.handleError)
      )
    ;
    
  }

}



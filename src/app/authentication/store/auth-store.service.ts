import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { User } from '../models/index';

@Injectable({
  providedIn: 'root'
})
export class AuthStoreService {
  private _currentUser$ = new BehaviorSubject<User>(null)

  constructor() {
    debugger;
    this.initUser();
   }

  get currentUser$(): Observable<User> {
    return this._currentUser$.asObservable();
  }


  // the getter will return the last value emitted...
  get currentUser(): User {
    return this._currentUser$.getValue();
  }

  // setter sends out new state to our subscribers
  set currentUser(user: User) {
    this._currentUser$.next(user);
  }



  initUser() {
    let initUser: User = {
      "email": "",
      "password": "",
      "jwt": "",
      "name": "",
      "role": ""
    }
    this.currentUser = initUser;
  }

  changeStateOrig(newState: User) {
    this.currentUser = newState;
  }

  changeState(newState: User, jwt: string) {
    debugger;
    const changedState = { ...newState, "jwt": jwt};
    this.currentUser = changedState;
  }


  getState(): User {
    return this.currentUser;
  }

  /*
  changeToken(token: string) {
    const currentState = this.currentUser;
    this.currentUser = {...currentState, "token": token};
  }
  */

  getToken() :string {
    return this.currentUser.jwt;
  }

  isAdmin(): boolean {
    return this.currentUser && this.currentUser.role === "admin";
  }

  
}

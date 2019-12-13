import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { User } from '../models/index';

@Injectable({
  providedIn: 'root'
})
export class AuthStoreService {
  private _currentUser$ = new BehaviorSubject<User>(null)

  constructor() { }

  get currentUser$(): Observable<User> {
    return this._currentUser$.asObservable();
  }

  // the getter will return the last value emitted...
  get currentUser(): User {
    //debugger;
    let user = this._currentUser$.getValue();
    if (user === null) {
      // get userIfo from session storage
      let userInfo = sessionStorage.getItem("userInfo");
      user = (userInfo) ? JSON.parse(userInfo) : null;
      // update the current user to those subscribing
      this._currentUser$.next(user);
    }
    return this._currentUser$.getValue();
  }

  // setter sends out new state to our subscribers
  set currentUser(user: User) {
    debugger;
    // Update userInfo session storage 
    user ? sessionStorage.setItem("userInfo", JSON.stringify(user)) : sessionStorage.removeItem("userInfo");
    this._currentUser$.next(user);
  }

  /*
  changeState(newState: User, jwt: string) {
    debugger;
    const changedState = { ...newState, "jwt": jwt};
    this.currentUser = changedState;
  }
  */
  changeState(newState: User, serverKey: string) {
    debugger;
    const changedState = { ...newState, "serverKey": serverKey};
    this.currentUser = changedState;
  }

  getState(): User {
    return this.currentUser;
  }

  getServerKey() :string {
    //return this.currentUser ? this.currentUser.jwt : "";
    return this.currentUser ? this.currentUser.serverKey : "";
  }

  isAdmin(): boolean {
    return this.currentUser && this.currentUser.role === "admin";
  }

  isLoggedIn(): boolean {
    //return this.currentUser && this.currentUser.jwt !== "";
    return this.currentUser && this.currentUser.serverKey !== "";
  }
  
}

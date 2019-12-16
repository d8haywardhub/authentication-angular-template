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
    let user = this._currentUser$.getValue();
    //console.log("get currentUser: ")
    //console.log(user);
    if (user === null) {
      // get userIfo from session storage
      //let userInfo = sessionStorage.getItem("userInfo");
      // get userInfo from local storage ..... allows for using different browser tabs !!
      let userInfo = localStorage.getItem("userInfo");
      user = (userInfo) ? JSON.parse(userInfo) : null;
      // update the current user to those subscribing
      this._currentUser$.next(user);
    }
    return this._currentUser$.getValue();
  }

  // setter sends out new state to our subscribers
  set currentUser(user: User) {
    console.log("set currentUser: ");
    console.log(user);
    // Update userInfo session storage 
    //user ? sessionStorage.setItem("userInfo", JSON.stringify(user)) : sessionStorage.removeItem("userInfo");
    // Update userInfo local storage ..... allows for using different browser tabs !!
    user ? localStorage.setItem("userInfo", JSON.stringify(user)) : localStorage.removeItem("userInfo");
    this._currentUser$.next(user);
    let nextUser = this._currentUser$.getValue();
    console.log("set currentUser after setting: ");
    console.log(nextUser);
  }

  changeState(newState: User, serverKey: string) {
    const changedState = { ...newState, "serverKey": serverKey};
    this.currentUser = changedState;
  }

  getState(): User {
    return this.currentUser;
  }

  getServerKey() :string {
    return this.currentUser ? this.currentUser.serverKey : "";
  }

  isAdmin(): boolean {
    return this.currentUser && this.currentUser.role === "admin";
  }

  isLoggedIn(): boolean {
    return this.currentUser && this.currentUser.serverKey !== "";
  }
  
}

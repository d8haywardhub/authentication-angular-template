import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { AuthStoreService } from '../authentication/store/auth-store.service';
import { User } from '../authentication/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  private unsubscribe = new Subject();
  public isRoot: boolean = true;
  public curUser: string = "";
  //public isAdmin: boolean = true;

  currentUser$: Observable<User>;
  
  constructor(private router: Router, private authStore: AuthStoreService) { }

  ngOnInit() {
    debugger;
    this.currentUser$ = this.authStore.currentUser$
    //this.isAdmin = this.authStore.isAdmin();
  }

  isAdmin() {
    return this.authStore.isAdmin();
  }

  isLoggedIn() {
    return this.authStore.currentUser.jwt !== "";
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
}

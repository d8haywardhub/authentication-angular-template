import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from '@angular/router';
//import { LoginComponent } from './authentication/components/login/login.component';


const routes: Routes = [
  //{ path: "", component: HomeComponent },
  {
    path: "login",
    loadChildren: "./authentication/authentication.module#AuthenticationModule",
    //data: { preload: true},
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }

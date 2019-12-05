import { NgModule } from '@angular/core';

//import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';



import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';

//import { JwtAuthenticationInterceptor } from './interceptors';

const authRoutes: Routes = [
  { path: "", component: LoginComponent }
];

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,


    //HttpClientModule, // So that we can use @angular/common/http/HttpClient



    RouterModule.forChild(authRoutes),
  ],
  /*providers: [
    // Interceptors
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtAuthenticationInterceptor,
      multi: true
    }
  ]*/
})
export class AuthenticationModule { }

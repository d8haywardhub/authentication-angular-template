import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
//import { catchError } from 'rxjs/operators';
import { AuthStoreService } from '../authentication/store/auth-store.service';


@Injectable()
export class JwtAuthenticationInterceptor implements HttpInterceptor {

    constructor(private authStoreService: AuthStoreService) { }

    intercept(req: HttpRequest<any>,
              next: HttpHandler): Observable<HttpEvent<any>> {
    debugger;
        //const idToken = localStorage.getItem("id_token");
        const idToken = this.authStoreService.getToken();

        if (idToken) {
            const cloned = req.clone({
                headers: req.headers.set("Authorization",
                    "Bearer " + idToken)
            });

            return next.handle(cloned);
        }
        else {
            return next.handle(req);
        }
    }
}
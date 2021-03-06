import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'app/shared/toast/ToastService';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class LogoutInterceptor implements HttpInterceptor {

    constructor(
        private _toast: ToastService,
        private _router: Router,
        private _translate: TranslateService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(e => {
                if (e instanceof HttpErrorResponse) {
                    if (req.url.indexOf('auth') === -1 && e.status === 401) {
                        let navigationExtras: NavigationExtras = {
                            queryParams: {}
                        };

                        if (this._router.routerState.snapshot.url
                            && this._router.routerState.snapshot.url.indexOf('auth') === -1) {
                            navigationExtras.queryParams = { redirect: this._router.routerState.snapshot.url };
                        }

                        this._router.navigate(['/auth/signin'], navigationExtras);
                    }
                    return observableThrowError(e);
                }
            }));
    }
}

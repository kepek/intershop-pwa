// tslint:disable: ish-ordered-imports project-structure
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, of, race, throwError, noop } from 'rxjs';
import { catchError, concatMap, map, switchMap, take } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { IdentityProvider, TriggerReturnType } from 'ish-core/identity-provider/identity-provider.interface';
import { selectQueryParam } from 'ish-core/store/core/router';
import { logoutUser } from 'ish-core/store/customer/user';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { whenTruthy } from 'ish-core/utils/operators';

export enum CamfilLoginOnBehalfQueryParams {
  AccessToken = 'access-token',
  ERPEmployeeID = 'ERPEmployeeID',
  ReturnUrl = 'returnUrl',
}

@Injectable({ providedIn: 'root' })
export class CamfilLoginOnBehalfIdentityProvider implements IdentityProvider {
  constructor(
    protected router: Router,
    protected store: Store,
    protected apiTokenService: ApiTokenService,
    protected accountFacade: AccountFacade,
    protected activatedRoute: ActivatedRoute
  ) {}

  getCapabilities() {
    return {
      editPassword: false,
      editEmail: false,
      editProfile: false,
    };
  }

  init() {
    this.apiTokenService.restore$().subscribe(noop);
  }

  triggerLogin(route: ActivatedRouteSnapshot): TriggerReturnType {
    let accessToken = route.queryParamMap.get(CamfilLoginOnBehalfQueryParams.AccessToken);
    // token is not encoded by ICM URL, so we need to reinsert '+'
    accessToken = decodeURIComponent(accessToken?.replace(/\s/g, '+'));

    let hasAccessToken = route.queryParamMap.has(CamfilLoginOnBehalfQueryParams.AccessToken);
    hasAccessToken = hasAccessToken && accessToken !== 'null';

    const erpEmployeeId = decodeURIComponent(route.queryParamMap.get(CamfilLoginOnBehalfQueryParams.ERPEmployeeID));
    let hasErpEmployeeId = route.queryParamMap.has(CamfilLoginOnBehalfQueryParams.ERPEmployeeID);
    hasErpEmployeeId = hasErpEmployeeId && erpEmployeeId !== 'null';

    const returnUrl = route?.queryParamMap?.get(CamfilLoginOnBehalfQueryParams.ReturnUrl) || '/dupa';

    if (hasErpEmployeeId) {
      window?.sessionStorage?.setItem(CamfilLoginOnBehalfQueryParams.ERPEmployeeID, erpEmployeeId);
    }

    if (hasAccessToken) {
      // initiate the user login with the access-token
      this.apiTokenService.removeApiToken();
      this.accountFacade.loginUserWithToken(accessToken);
    } else {
      // TODO (extMlk): set businessError and return false when on v0.29.0
      return false;
    }

    return race(
      // throw an error if a user login error occurs
      this.accountFacade.userError$.pipe(
        whenTruthy(),
        take(1),
        // tslint:disable-next-line:no-unnecessary-callback-wrapper
        concatMap(userError => throwError(userError))
      ),
      // continue once the user is logged in
      this.accountFacade.isLoggedIn$.pipe(
        whenTruthy(),
        take(1),
        switchMap(() => of(this.router.parseUrl(returnUrl)))
      )
    ).pipe(
      // general error handling (parameter missing, authentication error)
      catchError(error => {
        // TODO (extMlk): set businessError and return false when on v0.29.0
        console.log({ error });
        return of(this.router.parseUrl('/error'));
      })
    );
  }

  triggerLogout(): TriggerReturnType {
    window?.sessionStorage?.removeItem(CamfilLoginOnBehalfQueryParams.ERPEmployeeID);
    this.store.dispatch(logoutUser());
    this.apiTokenService.removeApiToken();
    return this.store.pipe(
      select(selectQueryParam('returnUrl')),
      map(returnUrl => returnUrl || '/home'),
      map(returnUrl => this.router.parseUrl(returnUrl))
    );
  }

  triggerRegister(): TriggerReturnType {
    return true;
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.apiTokenService.intercept(req, next);
  }
}

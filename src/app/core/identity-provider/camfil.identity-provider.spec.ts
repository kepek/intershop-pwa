import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Params, Router, UrlTree, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { EMPTY, Observable, Subject, of, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { anything, capture, instance, mock, resetCalls, spy, verify, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ApiService } from 'ish-core/services/api/api.service';
import { selectQueryParam } from 'ish-core/store/core/router';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { CAMFILIdentityProvider, CamfilIdentityParams } from './camfil.identity-provider';

@Component({ template: 'dummy' })
class DummyComponent {}

type ApiTokenCookieType = 'user' | 'basket' | 'order';

function getSnapshot(queryParams: Params): ActivatedRouteSnapshot {
  return {
    queryParamMap: convertToParamMap(queryParams),
  } as ActivatedRouteSnapshot;
}

describe('Camfil Identity Provider', () => {
  const apiService = mock(ApiService);
  const apiTokenService = mock(ApiTokenService);
  const appFacade = mock(AppFacade);
  const accountFacade = mock(AccountFacade);
  const checkoutFacade = mock(CheckoutFacade);
  const cookiesService = mock(CookiesService);

  let camfilIdentityProvider: CAMFILIdentityProvider;
  let store$: MockStore;
  let storeSpy$: MockStore;
  let router: Router;
  let cookieVanishes$: Subject<ApiTokenCookieType>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'home', component: DummyComponent },
          { path: 'logout', component: DummyComponent },
          { path: 'error', component: DummyComponent },
        ]),
      ],
      providers: [
        { provide: ApiService, useFactory: () => instance(apiService) },
        { provide: ApiTokenService, useFactory: () => instance(apiTokenService) },
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: CookiesService, useFactory: () => instance(cookiesService) },
        provideMockStore(),
      ],
    }).compileComponents();

    camfilIdentityProvider = TestBed.inject(CAMFILIdentityProvider);
    router = TestBed.inject(Router);
    store$ = TestBed.inject(MockStore);
    storeSpy$ = spy(store$);
  });

  beforeEach(() => {
    cookieVanishes$ = new Subject<ApiTokenCookieType>();
    when(apiTokenService.restore$(anything())).thenReturn(of(true));
    when(apiTokenService.cookieVanishes$).thenReturn(cookieVanishes$);

    resetCalls(apiService);
    resetCalls(apiTokenService);
    resetCalls(appFacade);
    resetCalls(accountFacade);
    resetCalls(checkoutFacade);
    resetCalls(cookiesService);

    window.sessionStorage.clear();
  });

  describe('init', () => {
    it('should restore apiToken on startup', () => {
      camfilIdentityProvider.init();
      verify(apiTokenService.cookieVanishes$).once();
      verify(apiTokenService.removeApiToken()).never();
    });
  });

  describe('triggerLogout', () => {
    beforeEach(() => {
      window.sessionStorage.setItem(CamfilIdentityParams.ERPEmployeeID, 'test-erp-id');
      store$.overrideSelector(selectQueryParam(anything()), undefined);
      camfilIdentityProvider.init();
    });

    it('should remove apiToken cookie and ERPEmployeeID from session storage on logout', () => {
      expect(window.sessionStorage.getItem(CamfilIdentityParams.ERPEmployeeID)).toEqual('test-erp-id');

      camfilIdentityProvider.triggerLogout();

      expect(window.sessionStorage.getItem(CamfilIdentityParams.ERPEmployeeID)).toBeNull();
      expect(capture(storeSpy$.dispatch).first()).toMatchInlineSnapshot(`[User] Logout User`);
      verify(apiTokenService.removeApiToken()).once();
    });

    it('should return to home page per default on subscribe', done => {
      const routerSpy = spy(router);

      const logoutTrigger$ = camfilIdentityProvider.triggerLogout() as Observable<UrlTree>;

      logoutTrigger$.subscribe(() => {
        verify(routerSpy.parseUrl('/home')).once();
        done();
      });
    });
  });

  describe('triggerLogin', () => {
    let routerSpy: Router;
    let queryParams = {};

    beforeEach(() => {
      routerSpy = spy(router);
      camfilIdentityProvider.init();
      when(accountFacade.userError$).thenReturn(EMPTY);
      when(accountFacade.isLoggedIn$).thenReturn(EMPTY);
    });

    it('should continue process without query params required to login on behalf', () => {
      const result$ = camfilIdentityProvider.triggerLogin(getSnapshot(queryParams));
      expect(result$).toBeTruthy();
    });

    describe('should try to login user on behalf with access-token from queryParams', () => {
      const accessToken = 'login-access-token';

      beforeEach(() => {
        queryParams = { 'access-token': accessToken };
      });

      it('should trigger loginUserWithToken method on login', () => {
        camfilIdentityProvider.triggerLogin(getSnapshot(queryParams));
        verify(accountFacade.loginUserWithToken(accessToken)).once();
      });
    });

    describe('race', () => {
      describe('isLoggedIn$ emits first', () => {
        beforeEach(() => {
          // userError$ first
          when(accountFacade.userError$).thenReturn(timer(Infinity).pipe(switchMap(() => EMPTY)));
          when(accountFacade.isLoggedIn$).thenReturn(of(true));
        });

        describe('redirect to home page after successful authentication', () => {
          beforeEach(() => {
            queryParams = { 'access-token': 'accessToken' };
          });

          it('should return to home page', done => {
            const login$ = camfilIdentityProvider.triggerLogin(getSnapshot(queryParams)) as Observable<
              boolean | UrlTree
            >;
            login$.subscribe(() => {
              verify(routerSpy.parseUrl('/home')).once();
              done();
            });
          });
        });
      });

      describe('userError$ emits first', () => {
        beforeEach(() => {
          when(accountFacade.userError$).thenReturn(of(makeHttpError({ message: 'userError' })));
          when(accountFacade.isLoggedIn$).thenReturn(timer(Infinity).pipe(switchMap(() => EMPTY)));
          queryParams = { 'access-token': 'accessToken' };
        });

        it('should return to error page', done => {
          const login$ = camfilIdentityProvider.triggerLogin(getSnapshot(queryParams)) as Observable<boolean | UrlTree>;
          login$.subscribe(() => {
            verify(routerSpy.parseUrl('/error')).once();
            done();
          });
        });
      });
    });
  });
});

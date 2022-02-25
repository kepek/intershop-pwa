import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { CamfilPwaStoreModule } from 'camfil-pwa/store/camfil-pwa-store.module';
import { Observable, Subject, of } from 'rxjs';
import { take } from 'rxjs/operators';

import { LARGE_BREAKPOINT_WIDTH, MEDIUM_BREAKPOINT_WIDTH } from 'ish-core/configurations/injection-keys';
import { ConfigurationEffects } from 'ish-core/store/core/configuration/configuration.effects';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';

import { applyIccConfiguration, initIcc } from './camfil-icc.actions';
import { CamfilIccEffects } from './camfil-icc.effects';

describe('Camfil Icc Effects', () => {
  let actions$: Observable<Action>;
  let effects: CamfilIccEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserTransferStateModule,
        CamfilPwaStoreModule.forTesting('camfilIcc'),
        CoreStoreModule.forTesting(['configuration'], [ConfigurationEffects, CamfilIccEffects]),
      ],
      providers: [
        provideMockActions(() => actions$),
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: MEDIUM_BREAKPOINT_WIDTH, useValue: 768 },
        { provide: LARGE_BREAKPOINT_WIDTH, useValue: 992 },
      ],
    });

    effects = TestBed.inject(CamfilIccEffects);
  });

  describe('initIcc$', () => {
    it('should import icc settings on effects init and complete', done => {
      // tslint:disable:use-async-synchronization-in-tests
      const testComplete$ = new Subject<void>();

      actions$ = of(initIcc());

      testComplete$.pipe(take(2)).subscribe({ complete: done });

      effects.initIcc$.subscribe(
        data => {
          expect(data.type).toEqual(applyIccConfiguration.type);
          testComplete$.next();
        },
        fail,
        () => testComplete$.next()
      );
      // tslint:enable:use-async-synchronization-in-tests
    });
  });
});

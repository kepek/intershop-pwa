import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, Subject, of } from 'rxjs';
import { take } from 'rxjs/operators';

import { LARGE_BREAKPOINT_WIDTH, MEDIUM_BREAKPOINT_WIDTH } from 'ish-core/configurations/injection-keys';
import { ConfigurationEffects } from 'ish-core/store/core/configuration/configuration.effects';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';

import { CamIccStoreModule } from '../cam-icc-store.module';

import { applyIccConfiguration, initIcc, setIccToken } from './icc.actions';
import { IccEffects } from './icc.effects';

describe('Icc Effects', () => {
  let actions$: Observable<Action>;
  let effects: IccEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserTransferStateModule,
        CamIccStoreModule.forTesting('_icc'),
        CoreStoreModule.forTesting(['configuration'], [ConfigurationEffects, IccEffects]),
      ],
      providers: [
        provideMockActions(() => actions$),
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: MEDIUM_BREAKPOINT_WIDTH, useValue: 768 },
        { provide: LARGE_BREAKPOINT_WIDTH, useValue: 992 },
      ],
    });

    effects = TestBed.inject(IccEffects);
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

  describe('setIccToken$', () => {
    beforeEach(() => {
      // on server
      process.env.ICC_TOKEN = 'dummy';
    });

    afterEach(() => {
      process.env.ICC_TOKEN = undefined;
    });

    it('should set the icc token once on effects init and complete', done => {
      // tslint:disable:use-async-synchronization-in-tests
      const testComplete$ = new Subject<void>();

      actions$ = of({ type: ROOT_EFFECTS_INIT });

      testComplete$.pipe(take(2)).subscribe({ complete: done });

      effects.setIccToken$.subscribe(
        data => {
          expect(data.type).toEqual(setIccToken.type);
          expect(data.payload).toHaveProperty('iccToken', 'dummy');
          testComplete$.next();
        },
        fail,
        () => testComplete$.next()
      );
      // tslint:enable:use-async-synchronization-in-tests
    });
  });
});

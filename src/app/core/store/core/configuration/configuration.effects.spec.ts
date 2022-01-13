import { PLATFORM_ID } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { instance, mock } from 'ts-mockito';

import { Locale } from 'ish-core/models/locale/locale.model';
import { getCurrentLocale } from 'ish-core/store/core/configuration/configuration.selectors';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';

import { applyConfiguration } from './configuration.actions';
import { ConfigurationEffects } from './configuration.effects';

describe('Configuration Effects', () => {
  let actions$: Observable<Action>;
  let effects: ConfigurationEffects;
  let translateServiceMock: TranslateService;

  beforeEach(() => {
    translateServiceMock = mock(TranslateService);

    TestBed.configureTestingModule({
      imports: [BrowserTransferStateModule, CoreStoreModule.forTesting(['configuration'], [ConfigurationEffects])],
      providers: [
        { provide: TranslateService, useFactory: () => instance(translateServiceMock) },
        provideMockActions(() => actions$),
        provideMockStore({ selectors: [{ selector: getCurrentLocale, value: { lang: 'en_US' } as Locale }] }),
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    });

    effects = TestBed.inject(ConfigurationEffects);
  });

  describe('setInitialRestEndpoint$', () => {
    it('should import settings on effects init and complete', done => {
      // tslint:disable:use-async-synchronization-in-tests
      const testComplete$ = new Subject<void>();

      actions$ = of({ type: ROOT_EFFECTS_INIT });

      testComplete$.pipe(take(2)).subscribe({ complete: done });

      effects.setInitialRestEndpoint$.subscribe(
        data => {
          expect(data.type).toEqual(applyConfiguration.type);
          testComplete$.next();
        },
        fail,
        () => testComplete$.next()
      );
      // tslint:enable:use-async-synchronization-in-tests
    });
  });

  describe('setLocale$', () => {
    beforeEach(() => {
      translateServiceMock.use('en_US');
    });
    it('should update TranslateService when locale was initialized', fakeAsync(() => {
      tick(1000);
      expect(translateServiceMock.currentLang).toMatchInlineSnapshot(`
        MethodToStub {
          "matchers": Array [],
          "methodStubCollection": MethodStubCollection {
            "items": Array [],
          },
          "mocker": Mocker {
            "clazz": [Function],
            "excludedPropertyNames": Array [
              "hasOwnProperty",
            ],
            "instance": Object {
              "(": [Function],
              "(!isDefined": [Function],
              "*/": [Function],
              "Error": [Function],
              "EventEmitter": [Function],
              "TranslateService": [Function],
              "__values": [Function],
              "addLangs": [Function],
              "assign": [Function],
              "call": [Function],
              "changeDefaultLang": [Function],
              "changeLang": [Function],
              "compile": [Function],
              "compileTranslations": [Function],
              "concat": [Function],
              "concatMap": [Function],
              "constructor": [Function],
              "defer": [Function],
              "emit": [Function],
              "forEach": [Function],
              "forkJoin": [Function],
              "get": [Function],
              "getBrowserCultureLang": [Function],
              "getBrowserLang": [Function],
              "getDefaultLang": [Function],
              "getLangs": [Function],
              "getParsedResult": [Function],
              "getStreamOnTranslationChange": [Function],
              "getTranslation": [Function],
              "getValue": [Function],
              "handle": [Function],
              "indexOf": [Function],
              "instant": [Function],
              "interpolate": [Function],
              "isObservable": [Function],
              "keys": [Function],
              "map": [Function],
              "mergeDeep": [Function],
              "next": [Function],
              "of": [Function],
              "pipe": [Function],
              "push": [Function],
              "reloadLang": [Function],
              "resetLang": [Function],
              "retrieveTranslations": [Function],
              "set": [Function],
              "setDefaultLang": [Function],
              "setTranslation": [Function],
              "shareReplay": [Function],
              "split": [Function],
              "stream": [Function],
              "subscribe": [Function],
              "switchMap": [Function],
              "take": [Function],
              "updateLangs": [Function],
              "use": [Function],
            },
            "methodActions": Array [
              MethodAction {
                "args": Array [],
                "callIndex": 2,
                "methodName": "ngOnDestroy",
              },
            ],
            "methodStubCollections": Object {
              "currentLang": MethodStubCollection {
                "items": Array [],
              },
              "use": MethodStubCollection {
                "items": Array [],
              },
            },
            "mock": Object {
              "(": [Function],
              "(!isDefined": [Function],
              "*/": [Function],
              "Error": [Function],
              "EventEmitter": [Function],
              "TranslateService": [Function],
              "__tsmockitoInstance": Object {
                "(": [Function],
                "(!isDefined": [Function],
                "*/": [Function],
                "Error": [Function],
                "EventEmitter": [Function],
                "TranslateService": [Function],
                "__values": [Function],
                "addLangs": [Function],
                "assign": [Function],
                "call": [Function],
                "changeDefaultLang": [Function],
                "changeLang": [Function],
                "compile": [Function],
                "compileTranslations": [Function],
                "concat": [Function],
                "concatMap": [Function],
                "constructor": [Function],
                "defer": [Function],
                "emit": [Function],
                "forEach": [Function],
                "forkJoin": [Function],
                "get": [Function],
                "getBrowserCultureLang": [Function],
                "getBrowserLang": [Function],
                "getDefaultLang": [Function],
                "getLangs": [Function],
                "getParsedResult": [Function],
                "getStreamOnTranslationChange": [Function],
                "getTranslation": [Function],
                "getValue": [Function],
                "handle": [Function],
                "indexOf": [Function],
                "instant": [Function],
                "interpolate": [Function],
                "isObservable": [Function],
                "keys": [Function],
                "map": [Function],
                "mergeDeep": [Function],
                "next": [Function],
                "of": [Function],
                "pipe": [Function],
                "push": [Function],
                "reloadLang": [Function],
                "resetLang": [Function],
                "retrieveTranslations": [Function],
                "set": [Function],
                "setDefaultLang": [Function],
                "setTranslation": [Function],
                "shareReplay": [Function],
                "split": [Function],
                "stream": [Function],
                "subscribe": [Function],
                "switchMap": [Function],
                "take": [Function],
                "updateLangs": [Function],
                "use": [Function],
              },
              "__tsmockitoMocker": [Circular],
              "__values": [Function],
              "addLangs": [Function],
              "assign": [Function],
              "call": [Function],
              "changeDefaultLang": [Function],
              "changeLang": [Function],
              "compile": [Function],
              "compileTranslations": [Function],
              "concat": [Function],
              "concatMap": [Function],
              "constructor": [Function],
              "defer": [Function],
              "emit": [Function],
              "forEach": [Function],
              "forkJoin": [Function],
              "get": [Function],
              "getBrowserCultureLang": [Function],
              "getBrowserLang": [Function],
              "getDefaultLang": [Function],
              "getLangs": [Function],
              "getParsedResult": [Function],
              "getStreamOnTranslationChange": [Function],
              "getTranslation": [Function],
              "getValue": [Function],
              "handle": [Function],
              "indexOf": [Function],
              "instant": [Function],
              "interpolate": [Function],
              "isObservable": [Function],
              "keys": [Function],
              "map": [Function],
              "mergeDeep": [Function],
              "next": [Function],
              "of": [Function],
              "pipe": [Function],
              "push": [Function],
              "reloadLang": [Function],
              "resetLang": [Function],
              "retrieveTranslations": [Function],
              "set": [Function],
              "setDefaultLang": [Function],
              "setTranslation": [Function],
              "shareReplay": [Function],
              "split": [Function],
              "stream": [Function],
              "subscribe": [Function],
              "switchMap": [Function],
              "take": [Function],
              "updateLangs": [Function],
              "use": [Function],
            },
            "mockableFunctionsFinder": MockableFunctionsFinder {
              "cleanFunctionNameRegex": /\\^\\[\\.\\\\s\\]\\(\\[\\^\\.\\\\s\\]\\+\\?\\)\\[\\\\s\\(\\]/,
              "excludedFunctionNames": Array [
                "hasOwnProperty",
                "function",
              ],
              "functionNameRegex": /\\[\\.\\\\s\\]\\(\\[\\^\\.\\\\s\\]\\+\\?\\)\\(\\?:\\\\\\(\\|\\\\s\\+=\\\\s\\+\\(\\?:function\\\\s\\*\\(\\?:\\[\\^\\.\\\\s\\]\\+\\?\\\\s\\*\\)\\?\\)\\?\\\\\\(\\)/g,
            },
            "objectInspector": ObjectInspector {},
            "objectPropertyCodeRetriever": ObjectPropertyCodeRetriever {},
          },
          "name": "currentLang",
        }
      `);
    }));
  });
});

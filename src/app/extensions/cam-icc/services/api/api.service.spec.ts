import { HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { noop } from 'rxjs';
import { anything, capture, spy, verify } from 'ts-mockito';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { serverError } from 'ish-core/store/core/error';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';

import { CamConfigurationStoreModule } from '../../../cam-configuration/store/cam-configuration-store.module';
import { loadCamfilConfigurationSuccess } from '../../../cam-configuration/store/configuration';
import { getIccRestEndpoint } from '../../store/icc';

import { ApiService } from './api.service';

// testing here is handled by http testing controller
// tslint:disable: use-async-synchronization-in-tests

describe('Api Service', () => {
  // TODO (extMlk): Replace with getIccRestEndpoint selector;
  const REST_URL = 'http://www.example.org/ICC';

  describe('ICC API Service Methods', () => {
    let apiService: ApiService;
    let storeSpy$: Store;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({
        // https://angular.io/guide/http#testing-http-requests
        imports: [HttpClientTestingModule],
        providers: [
          provideMockStore({ selectors: [{ selector: getIccRestEndpoint, value: 'http://www.example.org/ICC' }] }),
        ],
      });

      apiService = TestBed.inject(ApiService);
      httpTestingController = TestBed.inject(HttpTestingController);
      storeSpy$ = spy(TestBed.inject(Store));
    });

    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpTestingController.verify();
    });

    it('should call the httpClient.options method when apiService.options method is called.', done => {
      apiService.options('data').subscribe({
        next: data => {
          expect(data).toBeTruthy();
        },
        complete: done,
      });

      const req = httpTestingController.expectOne(`${REST_URL}/data`);
      req.flush({});
      expect(req.request.method).toEqual('OPTIONS');
    });

    it('should create Error Action if httpClient.options throws Error.', () => {
      const statusText = 'ERROAAR';

      apiService.options('data').subscribe(fail, fail);
      const req = httpTestingController.expectOne(`${REST_URL}/data`);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(noop);
      req.flush('err', { status: 500, statusText });
      consoleSpy.mockRestore();

      verify(storeSpy$.dispatch(anything())).once();
      // tslint:disable-next-line: no-any
      const [action] = capture(storeSpy$.dispatch).last() as any;
      expect(action.type).toEqual(serverError.type);
      expect(action.payload.error).toHaveProperty('statusText', statusText);
    });

    it('should call the httpClient.get method when apiService.get method is called.', done => {
      apiService.get('data').subscribe({
        next: data => {
          expect(data).toBeTruthy();
        },
        complete: done,
      });

      const req = httpTestingController.expectOne(`${REST_URL}/data`);
      req.flush({});
      expect(req.request.method).toEqual('GET');
    });

    it('should create Error Action if httpClient.get throws Error.', () => {
      const statusText = 'ERROAAR';

      apiService.get('data').subscribe(fail, fail);
      const req = httpTestingController.expectOne(`${REST_URL}/data`);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(noop);
      req.flush('err', { status: 500, statusText });
      consoleSpy.mockRestore();

      verify(storeSpy$.dispatch(anything())).once();
      // tslint:disable-next-line: no-any
      const [action] = capture(storeSpy$.dispatch).last() as any;
      expect(action.type).toEqual(serverError.type);
      expect(action.payload.error).toHaveProperty('statusText', statusText);
    });

    it('should call the httpClient.put method when apiService.put method is called.', done => {
      apiService.put('data').subscribe({
        next: data => {
          expect(data).toBeTruthy();
        },
        complete: done,
      });

      const req = httpTestingController.expectOne(`${REST_URL}/data`);
      req.flush({});
      expect(req.request.method).toEqual('PUT');
    });

    it('should call the httpClient.patch method when apiService.patch method is called.', done => {
      apiService.patch('data').subscribe({
        next: data => {
          expect(data).toBeTruthy();
        },
        complete: done,
      });

      const req = httpTestingController.expectOne(`${REST_URL}/data`);
      req.flush({});
      expect(req.request.method).toEqual('PATCH');
    });

    it('should call the httpClient.post method when apiService.post method is called.', done => {
      apiService.post('data').subscribe({
        next: data => {
          expect(data).toBeTruthy();
        },
        complete: done,
      });

      const req = httpTestingController.expectOne(`${REST_URL}/data`);
      req.flush({});
      expect(req.request.method).toEqual('POST');
    });

    it('should call the httpClient.delete method when apiService.delete method is called.', done => {
      apiService.delete('data').subscribe({
        next: data => {
          expect(data).toBeTruthy();
        },
        complete: done,
      });

      const req = httpTestingController.expectOne(`${REST_URL}/data`);
      req.flush({});
      expect(req.request.method).toEqual('DELETE');
    });
  });

  describe('ICC API Service Pipeable Operators', () => {
    let httpTestingController: HttpTestingController;
    let apiService: ApiService;

    const ahuManufacturerPath = `${REST_URL}/ahu/manufacturer`;
    const ahuManufacturerResponse = [
      {
        Name: 'Fläktwoods',
        Id: 4711,
        Market: ['SE', 'DK'],
        Description: [
          {
            lang: 'EN-US',
            ShortDescription: 'Flaektwoods',
          },
          {
            lang: 'SV-SE',
            ShortDescription: 'Fläktwoods',
          },
          {
            lang: 'EN-US',
            LongDescription:
              'Flaektwoods is the bla bla bla and something more as a mouse-over text or whatever you would like.',
          },
          {
            lang: 'SV-SE',
            LongDescription:
              'Fläktwoods är den bla bla bla och något ytterligare som kan visas som en mouse-over/popup text eller vad man nu önskar.',
          },
        ],
        Images: [
          {
            uri: 'https://camfil.com/some/CDN/uri/flaktwoods.png',
            type: 'logotype',
          },
        ],
      },
      {
        Name: 'Fläktmetals',
        Id: 4712,
        Market: ['SE', 'FI'],
        Description: [
          {
            lang: 'EN-US',
            ShortDescription: 'Flaektmetals',
          },
          {
            lang: 'SV-SE',
            ShortDescription: 'Fläktmetals',
          },
          {
            lang: 'EN-US',
            LongDescription:
              'Flaektmetals is the bla bla bla and something more as a mouse-over text or whatever you would like.',
          },
          {
            lang: 'SV-SE',
            LongDescription:
              'Fläktmetals är den bla bla bla och något ytterligare som kan visas som en mouse-over/popup text eller vad man nu önskar.',
          },
        ],
        Images: [
          {
            uri: 'https://camfil.com/some/CDN/uri/flaktmetals.png',
            type: 'logotype',
          },
        ],
      },
    ];

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          provideMockStore({ selectors: [{ selector: getIccRestEndpoint, value: 'http://www.example.org/ICC' }] }),
        ],
      });
      apiService = TestBed.inject(ApiService);
      httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpTestingController.verify();
    });

    it('should perform element translation when it is requested', done => {
      apiService.get('ahu/manufacturer').subscribe(data => {
        expect(JSON.stringify(data)).toEqual(JSON.stringify(ahuManufacturerResponse));
        done();
      });

      const req = httpTestingController.expectOne(ahuManufacturerPath);
      req.flush(ahuManufacturerResponse);
    });

    it('should return empty array on element translation when no elements are found', done => {
      apiService.get('ahu/manufacturer').subscribe(data => {
        expect(data).toBeEmpty();
        done();
      });

      const req = httpTestingController.expectOne(ahuManufacturerPath);
      req.flush({});
    });

    it('should not perform element or link translation when it is not requested', done => {
      apiService.get('ahu/manufacturer').subscribe(data => {
        expect(data).toEqual(ahuManufacturerResponse);
        done();
      });

      const req = httpTestingController.expectOne(ahuManufacturerPath);
      req.flush(ahuManufacturerResponse);
    });

    it('should return empty array on link translation when no links are available', done => {
      apiService.get('something').subscribe(data => {
        expect(data).toBeEmpty();
        done();
      });

      const req = httpTestingController.expectOne(`${REST_URL}/something`);
      req.flush([]);
    });

    it('should return empty array on element and link translation when source is empty', done => {
      apiService.get('ahu/manufacturer').subscribe(data => {
        expect(data).toBeEmpty();
        done();
      });

      const req = httpTestingController.expectOne(ahuManufacturerPath);
      req.flush({});
    });
  });

  describe('ICC API Service URL construction', () => {
    let apiService: ApiService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          provideMockStore({ selectors: [{ selector: getIccRestEndpoint, value: 'http://www.example.org/ICC' }] }),
        ],
      });

      apiService = TestBed.inject(ApiService);
      httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpTestingController.verify();
    });

    it('should bypass URL construction when path is an external link', () => {
      apiService.get('http://google.de').subscribe(fail, fail, fail);

      httpTestingController.expectOne('http://google.de');
    });

    it('should bypass URL construction when path is an external secure link', () => {
      apiService.get('https://google.de').subscribe(fail, fail, fail);

      httpTestingController.expectOne('https://google.de');
    });

    it('should construct a URL based on ICM REST API when supplying a relative URL', () => {
      apiService.get('relative').subscribe(fail, fail, fail);

      const reqs = httpTestingController.match(x => !!x);
      expect(reqs).toHaveLength(1);
      expect(reqs[0].request.urlWithParams).toMatchInlineSnapshot(`"http://www.example.org/ICC/relative"`);
    });

    it('should include query params when supplied', () => {
      apiService
        .get('relative', { params: new HttpParams().set('view', 'grid').set('depth', '3') })
        .subscribe(fail, fail, fail);

      const reqs = httpTestingController.match(x => !!x);
      expect(reqs).toHaveLength(1);
      expect(reqs[0].request.urlWithParams).toMatchInlineSnapshot(
        `"http://www.example.org/ICC/relative?view=grid&depth=3"`
      );
    });

    it('should construct a URL based on ICM REST API when supplying a deep relative URL', () => {
      apiService.get('very/deep/relative/url').subscribe(fail, fail, fail);

      const reqs = httpTestingController.match(x => !!x);
      expect(reqs).toHaveLength(1);
      expect(reqs[0].request.urlWithParams).toMatchInlineSnapshot(
        `"http://www.example.org/ICC/very/deep/relative/url"`
      );
    });

    it('should include params, locale for complex example', () => {
      apiService
        .get('very/deep/relative', { params: new HttpParams().set('view', 'grid').set('depth', '3') })
        .subscribe(fail, fail, fail);

      const reqs = httpTestingController.match(x => !!x);
      expect(reqs).toHaveLength(1);
      expect(reqs[0].request.urlWithParams).toMatchInlineSnapshot(
        `"http://www.example.org/ICC/very/deep/relative?view=grid&depth=3"`
      );
    });
  });

  describe('ICC API Service Headers', () => {
    let apiService: ApiService;
    let store$: Store;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({
        // https://angular.io/guide/http#testing-http-requests
        imports: [
          CamConfigurationStoreModule.forTesting('configuration'),
          CoreStoreModule.forTesting(['configuration']),
          CustomerStoreModule.forTesting('user'),
          HttpClientTestingModule,
        ],
        providers: [
          provideMockStore({ selectors: [{ selector: getIccRestEndpoint, value: 'http://www.example.org/ICC' }] }),
        ],
      });

      apiService = TestBed.inject(ApiService);
      httpTestingController = TestBed.inject(HttpTestingController);
      store$ = TestBed.inject(Store);
      store$.dispatch(
        loadCamfilConfigurationSuccess({
          configuration: {
            icc: {
              apiBaseURL: REST_URL,
              apiToken: 'XXXX-YYYY-ZZZZ',
            },
          },
        })
      );
    });

    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpTestingController.verify();
    });

    it('should always have default headers', () => {
      apiService.get('dummy').subscribe(fail, fail, fail);

      const req = httpTestingController.expectOne(`${REST_URL}/dummy`);
      expect(req.request.headers.keys()).not.toBeEmpty();
      expect(req.request.headers.get('content-type')).toEqual('application/json');
      expect(req.request.headers.get('Accept')).toEqual('application/json');
    });

    it('should always append additional headers', () => {
      apiService
        .get('dummy', {
          headers: new HttpHeaders({
            dummy: 'test',
          }),
        })
        .subscribe(fail, fail, fail);

      const req = httpTestingController.expectOne(`${REST_URL}/dummy`);
      expect(req.request.headers.keys()).not.toBeEmpty();
      expect(req.request.headers.has('dummy')).toBeTrue();
      expect(req.request.headers.get('content-type')).toEqual('application/json');
      expect(req.request.headers.get('Accept')).toEqual('application/json');
    });

    it('should always have overridable default headers', () => {
      apiService
        .get('dummy', {
          headers: new HttpHeaders({
            Accept: 'application/xml',
            'content-type': 'application/xml',
          }),
        })
        .subscribe(fail, fail, fail);

      const req = httpTestingController.expectOne(`${REST_URL}/dummy`);
      expect(req.request.headers.keys()).not.toBeEmpty();
      expect(req.request.headers.get('content-type')).toEqual('application/xml');
      expect(req.request.headers.get('Accept')).toEqual('application/xml');
    });
  });

  describe('ICC API Service exclusive runs', () => {
    let apiService: ApiService;
    let store$: Store;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          CamConfigurationStoreModule.forTesting('configuration'),
          CoreStoreModule.forTesting(['configuration']),
          HttpClientTestingModule,
        ],
        providers: [
          provideMockStore({ selectors: [{ selector: getIccRestEndpoint, value: 'http://www.example.org/ICC' }] }),
        ],
      });

      apiService = TestBed.inject(ApiService);
      httpTestingController = TestBed.inject(HttpTestingController);
      store$ = TestBed.inject(Store);
      store$.dispatch(
        loadCamfilConfigurationSuccess({
          configuration: {
            icc: {
              apiBaseURL: REST_URL,
              apiToken: 'XXXX-YYYY-ZZZZ',
            },
          },
        })
      );
    });

    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpTestingController.verify();
    });

    it('should run call exclusively when asked for it', done => {
      let syncData;

      apiService.get('dummy1', { runExclusively: true }).subscribe(data => {
        expect(data).toBeTruthy();
        syncData = data;
      });

      const req1 = httpTestingController.expectOne(`${REST_URL}/dummy1`);

      setTimeout(() => {
        req1.flush('TEST1');
      }, 2000);

      apiService.get('dummy2').subscribe(data => {
        expect(data).toBeTruthy();
        expect(syncData).toEqual('TEST1');
      });

      apiService.get('dummy3').subscribe(data => {
        expect(data).toBeTruthy();
        expect(syncData).toEqual('TEST1');
        done();
      });

      httpTestingController.verify();
      setTimeout(() => httpTestingController.verify(), 500);
      setTimeout(() => httpTestingController.verify(), 1000);
      setTimeout(() => httpTestingController.verify(), 1500);

      setTimeout(() => {
        const req2 = httpTestingController.expectOne(`${REST_URL}/dummy2`);
        req2.flush('TEST2');
      }, 2500);
      setTimeout(() => {
        const req3 = httpTestingController.expectOne(`${REST_URL}/dummy3`);
        req3.flush('TEST3');
      }, 3000);
    });

    it('should run calls in parallel if not explicitly run exclusively', done => {
      let syncData;

      apiService.get('dummy1').subscribe(data => {
        expect(data).toBeTruthy();
        expect(syncData).toEqual('TEST2');
        syncData = data;
      });

      const req1 = httpTestingController.expectOne(`${REST_URL}/dummy1`);

      apiService.get('dummy2').subscribe(data => {
        expect(data).toBeTruthy();
        syncData = data;
      });

      const req2 = httpTestingController.expectOne(`${REST_URL}/dummy2`);

      apiService.get('dummy3').subscribe(data => {
        expect(data).toBeTruthy();
        expect(syncData).toEqual('TEST1');
        done();
      });

      const req3 = httpTestingController.expectOne(`${REST_URL}/dummy3`);

      setTimeout(() => {
        req1.flush('TEST1');
      }, 2000);
      setTimeout(() => {
        req2.flush('TEST2');
      }, 1500);
      setTimeout(() => {
        req3.flush('TEST3');
      }, 3000);
    });
  });
});

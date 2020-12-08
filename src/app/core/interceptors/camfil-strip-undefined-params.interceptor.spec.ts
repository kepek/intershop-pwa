import { HTTP_INTERCEPTORS, HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { ApiService } from 'ish-core/services/api/api.service';
import { getCurrentLocale, getICMServerURL, getRestEndpoint } from 'ish-core/store/core/configuration';
import { getPGID } from 'ish-core/store/customer/user';

import { CamfilStripUndefinedParamsInterceptor } from './camfil-strip-undefined-params-interceptor.service';

describe('Camfil Strip Undefined Params Interceptor', () => {
  const REST_URL = 'http://www.example.org/WFS/site/-';

  let apiService: ApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CamfilStripUndefinedParamsInterceptor,
        { provide: HTTP_INTERCEPTORS, useClass: CamfilStripUndefinedParamsInterceptor, multi: true },
        provideMockStore({
          selectors: [
            { selector: getRestEndpoint, value: 'http://www.example.org/WFS/site/-' },
            { selector: getICMServerURL, value: undefined },
            { selector: getCurrentLocale, value: undefined },
            { selector: getPGID, value: undefined },
          ],
        }),
      ],
    });

    apiService = TestBed.inject(ApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should be created', () => {
    const interceptor = TestBed.inject(CamfilStripUndefinedParamsInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it('should remove undefined query params from the request url to make it simpler', done => {
    const toBePersistedParamName = 'myParam';
    const toBeRemovedParamName = 'anotherUndefinedParam';

    const params = new HttpParams().set(toBePersistedParamName, '123').set(toBeRemovedParamName, undefined);

    apiService.get('data', { params }).subscribe({
      next: data => {
        expect(data).toBeTruthy();
      },
      complete: done,
    });

    const req = httpTestingController.expectOne(`${REST_URL}/data?${toBePersistedParamName}=123`);
    req.flush({});
    expect(req.request.method).toEqual('GET');
    expect(req.request.params.keys().some(k => k === toBeRemovedParamName)).toBeFalsy();
    expect(req.request.params.keys().some(k => k === toBePersistedParamName)).toBeTruthy();
  });
});

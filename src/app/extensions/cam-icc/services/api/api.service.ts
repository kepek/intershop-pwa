import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subject, combineLatest, defer, forkJoin, of } from 'rxjs';
import { concatMap, first, map, tap } from 'rxjs/operators';

import { ApiServiceErrorHandler } from 'ish-core/services/api/api.service.errorhandler';

import { getIccRestEndpoint } from '../../store/icc';

export interface AvailableOptions {
  params?: HttpParams;
  headers?: HttpHeaders;
  skipApiErrorHandling?: boolean;
  runExclusively?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private executionBarrier$: Observable<void> | Subject<void> = of(undefined);

  constructor(
    private httpClient: HttpClient,
    private apiServiceErrorHandler: ApiServiceErrorHandler,
    private store: Store
  ) {}

  /**
   * merges supplied and default headers
   */
  private constructHeaders(options?: AvailableOptions): Observable<HttpHeaders> {
    const defaultHeaders = new HttpHeaders().set('content-type', 'application/json').set('Accept', 'application/json');

    return of(
      options?.headers
        ? // append incoming headers to default ones
          options.headers.keys().reduce((acc, key) => acc.set(key, options.headers.get(key)), defaultHeaders)
        : // just use default headers
          defaultHeaders
    );
  }

  private execute<T>(options: AvailableOptions, httpCall$: Observable<T>): Observable<T> {
    const wrappedCall$ = httpCall$.pipe(this.apiServiceErrorHandler.handleErrors(!options?.skipApiErrorHandling));

    if (options?.runExclusively) {
      // setup a barrier for other calls
      const subject$ = new Subject<void>();
      this.executionBarrier$ = subject$;
      const releaseBarrier = () => {
        subject$.next();
        this.executionBarrier$ = of(undefined);
      };

      // release barrier on completion
      return wrappedCall$.pipe(tap({ complete: releaseBarrier, error: releaseBarrier }));
    } else {
      // respect barrier
      return this.executionBarrier$.pipe(concatMap(() => wrappedCall$));
    }
  }

  // tslint:disable-next-line:variable-name
  private constructUrlForPath(path: string, _options?: AvailableOptions): Observable<string> {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return of(path);
    }
    return combineLatest([
      // base url
      this.store.pipe(select(getIccRestEndpoint)),
      // first path segment
      of('/'),
      of(path.includes('/') ? path.split('/')[0] : path),
      // remaining path
      of(path.includes('/') ? path.substr(path.indexOf('/')) : ''),
    ]).pipe(
      first(),
      map(arr => arr.join(''))
    );
  }

  private constructHttpClientParams(
    path: string,
    options?: AvailableOptions
  ): Observable<[string, { headers: HttpHeaders; params: HttpParams }]> {
    return forkJoin([
      this.constructUrlForPath(path, options),
      defer(() =>
        this.constructHeaders(options).pipe(
          map(headers => ({
            params: options?.params,
            headers,
          }))
        )
      ),
    ]);
  }

  /**
   * http get request
   */
  get<T>(path: string, options?: AvailableOptions): Observable<T> {
    return this.execute(
      options,
      this.constructHttpClientParams(path, options).pipe(
        concatMap(([url, httpOptions]) => this.httpClient.get<T>(url, httpOptions))
      )
    );
  }

  /**
   * http options request
   */
  options<T>(path: string, options?: AvailableOptions): Observable<T> {
    return this.execute(
      options,
      this.constructHttpClientParams(path, options).pipe(
        concatMap(([url, httpOptions]) => this.httpClient.options<T>(url, httpOptions))
      )
    );
  }

  /**
   * http put request
   */
  put<T>(path: string, body = {}, options?: AvailableOptions): Observable<T> {
    return this.execute(
      options,
      this.constructHttpClientParams(path, options).pipe(
        concatMap(([url, httpOptions]) => this.httpClient.put<T>(url, body, httpOptions))
      )
    );
  }

  /**
   * http patch request
   */
  patch<T>(path: string, body = {}, options?: AvailableOptions): Observable<T> {
    return this.execute(
      options,
      this.constructHttpClientParams(path, options).pipe(
        concatMap(([url, httpOptions]) => this.httpClient.patch<T>(url, body, httpOptions))
      )
    );
  }

  /**
   * http post request
   */
  post<T>(path: string, body = {}, options?: AvailableOptions): Observable<T> {
    return this.execute(
      options,
      this.constructHttpClientParams(path, options).pipe(
        concatMap(([url, httpOptions]) => this.httpClient.post<T>(url, body, httpOptions))
      )
    );
  }

  /**
   * http delete request
   */
  delete<T>(path: string, options?: AvailableOptions): Observable<T> {
    return this.execute(
      options,
      this.constructHttpClientParams(path, options).pipe(
        concatMap(([url, httpOptions]) => this.httpClient.delete<T>(url, httpOptions))
      )
    );
  }
}

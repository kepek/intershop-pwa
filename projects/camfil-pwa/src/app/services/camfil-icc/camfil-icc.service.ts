import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select } from '@ngrx/store';
import { getIccRestEndpoint } from 'camfil-pwa/store/camfil-icc';
import { Observable, combineLatest, of } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { ApiService } from 'ish-core/services/api/api.service';

export interface AvailableOptions {
  params?: HttpParams;
  headers?: HttpHeaders;
  skipApiErrorHandling?: boolean;
  runExclusively?: boolean;
}

@Injectable({ providedIn: 'root' })
export class CamfilIccService extends ApiService {
  // tslint:disable-next-line:variable-name
  protected constructUrlForPath(path: string, _options?: AvailableOptions): Observable<string> {
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
}

// tslint:disable: project-structure ish-ordered-imports

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Strip out any `undefined` parameters in the query string.
 */
@Injectable()
export class CamfilStripUndefinedParamsInterceptor implements HttpInterceptor {
  /**
   * Iterate through query parameters and remove all those that are `undefined`.
   *
   * @param request The incoming request.
   * @param next The next handler.
   * @returns The handled request.
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let newRequest = request;
    let params = newRequest.params;
    for (const key of newRequest.params.keys()) {
      if (params.get(key) === undefined) {
        params = params.delete(key, undefined);
      }
    }
    newRequest = newRequest.clone({ params });
    return next.handle(newRequest);
  }
}

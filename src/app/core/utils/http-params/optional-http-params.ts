import { HttpParams } from '@angular/common/http';

export function createOptionalHttpParams(params: {}): HttpParams {
  let httpParams = new HttpParams();
  Object.keys(params).forEach(param => {
    if (params[param]) {
      httpParams = httpParams.set(param, params[param]);
    }
  });

  return httpParams;
}

import { TestBed } from '@angular/core/testing';

import { CamfilStripUndefinedParamsInterceptor } from './camfil-strip-undefined-params-interceptor.service';

describe('Camfil Strip Undefined Params Interceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [CamfilStripUndefinedParamsInterceptor],
    })
  );

  it('should be created', () => {
    const interceptor = TestBed.inject(CamfilStripUndefinedParamsInterceptor);
    expect(interceptor).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { CamfilDatePipe } from './camfil-date.pipe';

describe('Camfil Date Pipe', () => {
  let camfilDatePipe: CamfilDatePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CamfilDatePipe],
    });
    camfilDatePipe = TestBed.inject(CamfilDatePipe);
  });

  it('should be created', () => {
    expect(camfilDatePipe).toBeTruthy();
  });

  it('should transform true to okay', () => {
    expect(camfilDatePipe.transform(new Date())).toEqual('test: okay');
  });

  it('should transform false to failed', () => {
    // @ts-ignore
    expect(camfilDatePipe.transform(false)).toEqual('test: failed');
  });
});

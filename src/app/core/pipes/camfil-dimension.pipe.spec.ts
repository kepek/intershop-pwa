import { TestBed } from '@angular/core/testing';

import { CamfilDimensionPipe } from './camfil-dimension.pipe';

describe('Camfil Dimension Pipe', () => {
  let camfilDimensionPipe: CamfilDimensionPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CamfilDimensionPipe],
    });
    camfilDimensionPipe = TestBed.inject(CamfilDimensionPipe);
  });

  it('should be created', () => {
    expect(camfilDimensionPipe).toBeTruthy();
  });

  it('should transform true to okay', () => {
    expect(camfilDimensionPipe.transform(true)).toEqual('test: okay');
  });

  it('should transform false to failed', () => {
    expect(camfilDimensionPipe.transform(false)).toEqual('test: failed');
  });
});

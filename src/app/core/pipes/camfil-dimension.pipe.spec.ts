import { TestBed } from '@angular/core/testing';

import { Attribute } from 'ish-core/models/attribute/attribute.model';

import { CamfilDimensionPipe } from './camfil-dimension.pipe';

describe('Camfil Dimension Pipe', () => {
  let camfilDimensionPipe: CamfilDimensionPipe;
  const attributes: Attribute<string>[] = [
    {
      name: 'Test',
      type: 'String',
      value: 'Hello',
    },
  ];

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
    expect(camfilDimensionPipe.transform(attributes)).toEqual('test: okay');
  });

  it('should transform false to failed', () => {
    // @ts-ignore
    expect(camfilDimensionPipe.transform(false)).toEqual('test: failed');
  });
});

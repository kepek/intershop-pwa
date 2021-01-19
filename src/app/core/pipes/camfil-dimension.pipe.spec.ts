import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { AttributeToStringPipe } from 'ish-core/models/attribute/attribute.pipe';
import { Product } from 'ish-core/models/product/product.model';

import { CamfilDimensionPipe } from './camfil-dimension.pipe';

describe('Camfil Dimension Pipe', () => {
  let camfilDimensionPipe: CamfilDimensionPipe;
  let translateService: TranslateService;
  let product: Product;

  beforeEach(() => {
    product = {
      attributes: [
        {
          name: 'width',
          value: {
            value: 123,
          },
        },
        {
          name: 'depth',
          value: {
            value: 123,
          },
        },
        {
          name: 'height',
          value: {
            value: 123,
          },
        },
      ],
    } as Product;

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [CamfilDimensionPipe, AttributeToStringPipe],
    });

    TestBed.inject(AttributeToStringPipe);

    camfilDimensionPipe = TestBed.inject(CamfilDimensionPipe);
    translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    translateService.use('en');
  });

  it('should be created', () => {
    expect(camfilDimensionPipe).toBeTruthy();
  });

  it('should transform true to okay', () => {
    expect(camfilDimensionPipe.transform(product)).toEqual('123x123x123');
  });
});

import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { AttributeGroupTypes } from 'ish-core/models/attribute-group/attribute-group.types';
import { AttributeToStringPipe } from 'ish-core/models/attribute/attribute.pipe';
import { Product } from 'ish-core/models/product/product.model';

import { CamfilProductAttributeValPipe } from './camfil-product-attribute-val';

describe('Camfil Product Attribute Val', () => {
  let camfilProductAttributeValPipe: CamfilProductAttributeValPipe;
  let translateService: TranslateService;
  let product: Product;
  const listLabel = AttributeGroupTypes.ProductsListLabelAttributes;

  beforeEach(() => {
    product = ({
      attributeGroups: {
        [listLabel]: {
          attributes: [
            {
              name: 'Test',
              type: 'String',
              value: 'Hello',
            },
          ],
        },
      },
    } as unknown) as Product;

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [CamfilProductAttributeValPipe, AttributeToStringPipe],
    });

    TestBed.inject(AttributeToStringPipe);

    camfilProductAttributeValPipe = TestBed.inject(CamfilProductAttributeValPipe);
    translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    translateService.use('en');
  });

  it('should be created', () => {
    expect(camfilProductAttributeValPipe).toBeTruthy();
  });

  it('should transform true to okay', () => {
    expect(camfilProductAttributeValPipe.transform(product, 'Test')).toEqual('Hello');
  });
});

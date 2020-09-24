import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { ProductBundle } from 'ish-core/models/product/product-bundle.model';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { CamfilProductAddToBasketComponent } from 'ish-shared/components/product/camfil-product-add-to-basket/camfil-product-add-to-basket.component';
import { CamfilProductItemComponent } from 'ish-shared/components/product/camfil-product-item/camfil-product-item.component';

import { ProductBundlePartsComponent } from './product-bundle-parts.component';

describe('Product Bundle Parts Component', () => {
  let component: ProductBundlePartsComponent;
  let fixture: ComponentFixture<ProductBundlePartsComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        MockComponent(CamfilProductAddToBasketComponent),
        MockComponent(CamfilProductItemComponent),
        ProductBundlePartsComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBundlePartsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.product = {
      bundledProducts: [
        { sku: '1', quantity: 3 },
        { sku: '2', quantity: 1 },
      ],
    } as ProductBundle;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      Array [
        "camfil-product-item",
        "camfil-product-item",
        "camfil-product-add-to-basket",
      ]
    `);
  });
});

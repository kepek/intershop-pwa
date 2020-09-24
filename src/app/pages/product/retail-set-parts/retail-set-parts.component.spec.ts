import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamfilProductAddToBasketComponent } from 'ish-shared/components/product/camfil-product-add-to-basket/camfil-product-add-to-basket.component';
import { CamfilProductItemComponent } from 'ish-shared/components/product/camfil-product-item/camfil-product-item.component';
import { MockComponent } from 'ng-mocks';
import { RetailSetPartsComponent } from './retail-set-parts.component';
import { TranslateModule } from '@ngx-translate/core';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';

describe('Retail Set Parts Component', () => {
  let component: RetailSetPartsComponent;
  let fixture: ComponentFixture<RetailSetPartsComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        MockComponent(CamfilProductAddToBasketComponent),
        MockComponent(CamfilProductItemComponent),
        RetailSetPartsComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailSetPartsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.parts = [
      { sku: '1', quantity: 2 },
      { sku: '2', quantity: 2 },
      { sku: '3', quantity: 2 },
    ];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display elements for each part', () => {
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      Array [
        "camfil-product-add-to-basket",
        "camfil-product-item",
        "camfil-product-item",
        "camfil-product-item",
      ]
    `);
  });
});

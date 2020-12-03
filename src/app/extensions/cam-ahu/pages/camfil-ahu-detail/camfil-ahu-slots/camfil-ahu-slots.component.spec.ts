import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';

import { PricePipe } from 'ish-core/models/price/price.pipe';
import { Product } from 'ish-core/models/product/product.model';
import { CamfilProductAttributeComponent } from 'ish-shared/components/product/camfil-product-attribute/camfil-product-attribute.component';
import { CamfilProductImageComponent } from 'ish-shared/components/product/camfil-product-image/camfil-product-image.component';
import { CamfilProductInventoryComponent } from 'ish-shared/components/product/camfil-product-inventory/camfil-product-inventory.component';
import { CamfilProductQuantityComponent } from 'ish-shared/components/product/camfil-product-quantity/camfil-product-quantity.component';
import { CamfilProductTitleComponent } from 'ish-shared/components/product/camfil-product-title/camfil-product-title.component';

import { CamfilAhuSlotsComponent } from './camfil-ahu-slots.component';

describe('Camfil Ahu Slots Component', () => {
  let component: CamfilAhuSlotsComponent;
  let fixture: ComponentFixture<CamfilAhuSlotsComponent>;
  let element: HTMLElement;
  let product: Product;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CamfilAhuSlotsComponent,
        MockComponent(CamfilProductAttributeComponent),
        MockComponent(CamfilProductImageComponent),
        MockComponent(CamfilProductInventoryComponent),
        MockComponent(CamfilProductQuantityComponent),
        MockComponent(CamfilProductTitleComponent),
        MockPipe(PricePipe),
      ],
      imports: [TranslateModule.forRoot()],
      providers: [provideMockStore()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilAhuSlotsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    product = { sku: 'sku' } as Product;
    product.inStock = true;
    product.minOrderQuantity = 1;
    product.availability = true;

    component.product = product;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

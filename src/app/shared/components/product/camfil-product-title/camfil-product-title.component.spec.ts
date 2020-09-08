import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockPipe } from 'ng-mocks';

import {
  ProductView,
  VariationProductMasterView,
  VariationProductView,
} from 'ish-core/models/product-view/product-view.model';
import { ProductRoutePipe } from 'ish-core/routing/product/product-route.pipe';

import { CamfilProductTitleComponent } from './camfil-product-title.component';

describe('Camfil Product Title Component', () => {
  let product: ProductView | VariationProductView | VariationProductMasterView;
  let component: CamfilProductTitleComponent;
  let fixture: ComponentFixture<CamfilProductTitleComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CamfilProductTitleComponent, MockPipe(ProductRoutePipe)],
      imports: [RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilProductTitleComponent);
    product = { sku: 'sku' } as ProductView;
    product.inStock = true;
    product.minOrderQuantity = 1;
    product.availability = true;
    component = fixture.componentInstance;
    component.product = product;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

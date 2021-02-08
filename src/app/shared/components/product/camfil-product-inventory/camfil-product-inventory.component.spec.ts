import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { Product } from 'ish-core/models/product/product.model';

import { CamfilProductInventoryComponent } from './camfil-product-inventory.component';

describe('Camfil Product Inventory Component', () => {
  let component: CamfilProductInventoryComponent;
  let fixture: ComponentFixture<CamfilProductInventoryComponent>;
  let product: Product;
  let translate: TranslateService;
  let element: HTMLElement;
  let shoppingFacadeMock: ShoppingFacade;

  beforeEach(async () => {
    shoppingFacadeMock = mock(ShoppingFacade);
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [CamfilProductInventoryComponent],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacadeMock) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilProductInventoryComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
    product = { sku: 'sku' } as Product;
    element = fixture.nativeElement;
    component.product = product;
    component.isAvailabilityDotVisible = true;

    when(shoppingFacadeMock.product$(anything(), anything())).thenReturn(of({ sku: '4713' } as ProductView));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should throw an error if input parameter product is not set properly', () => {
    component.product = undefined;
    expect(() => fixture.detectChanges()).toThrow();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockComponents, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { ProductRoutePipe } from 'ish-core/routing/product/product-route.pipe';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { BasketPromotionComponent } from 'ish-shared/components/basket/basket-promotion/basket-promotion.component';
import { LineItemDescriptionComponent } from 'ish-shared/components/line-item/line-item-description/line-item-description.component';
import { PromotionDetailsComponent } from 'ish-shared/components/promotion/promotion-details/promotion-details.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';
import { CamfilProductImageComponent } from 'ish-shell/header/camfil-product-image/camfil-product-image.component';

import { LazyProductAddToOrderTemplateComponent } from '../../../../extensions/order-templates/exports/lazy-product-add-to-order-template/lazy-product-add-to-order-template.component';
import { LazyProductAddToWishlistComponent } from '../../../../extensions/wishlists/exports/lazy-product-add-to-wishlist/lazy-product-add-to-wishlist.component';

import { CamfilLineItemTableComponent } from './camfil-line-item-table.component';

describe('Camfil Line Item Table Component', () => {
  let component: CamfilLineItemTableComponent;
  let fixture: ComponentFixture<CamfilLineItemTableComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const shoppingFacade = mock(ShoppingFacade);
    when(shoppingFacade.product$(anything(), anything())).thenReturn(of({} as ProductView));

    await TestBed.configureTestingModule({
      declarations: [
        CamfilLineItemTableComponent,
        MockComponent(BasketPromotionComponent),
        MockComponent(CamfilProductImageComponent),
        MockComponent(FaIconComponent),
        MockComponent(InputComponent),
        MockComponent(LineItemDescriptionComponent),
        MockComponent(PromotionDetailsComponent),
        MockComponents(LazyProductAddToOrderTemplateComponent),
        MockComponents(LazyProductAddToWishlistComponent),
        MockPipe(DatePipe),
        MockPipe(PricePipe),
        MockPipe(ProductRoutePipe),
      ],
      imports: [ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilLineItemTableComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.lineItems = [BasketMockData.getBasketItem()];
  });

  it('should be created', () => {
    const shoppingFacade = mock(ShoppingFacade);
    when(shoppingFacade.product$(anything(), anything())).thenReturn(of({} as ProductView));
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ProductRoutePipe } from 'ish-core/routing/product/product-route.pipe';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { CamfilMiniBasketComponent } from './camfil-mini-basket.component';

describe('Camfil Mini Basket Component', () => {
  let component: CamfilMiniBasketComponent;
  let fixture: ComponentFixture<CamfilMiniBasketComponent>;
  let element: HTMLElement;
  let checkoutFacade: CheckoutFacade;

  beforeEach(async(() => {
    checkoutFacade = mock(CheckoutFacade);
    const accountFacade = mock(AccountFacade);
    when(accountFacade.userPriceDisplayType$).thenReturn(of('gross'));

    TestBed.configureTestingModule({
      declarations: [CamfilMiniBasketComponent, MockPipe(ProductRoutePipe)],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilMiniBasketComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    const translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
    const lineItem = BasketMockData.getBasketItem();

    when(checkoutFacade.basketItemCount$).thenReturn(of(lineItem.quantity.value * 3));
    when(checkoutFacade.basketChange$).thenReturn(EMPTY);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  xit('should display summary when collapsed', () => {
    fixture.detectChanges();
    expect(element.textContent.replace(/ /g, '')).toMatchInlineSnapshot(
      `"  camfil.shopping_cart.ministatus.items.label  30/$141,796.98"`
    );
  });
});

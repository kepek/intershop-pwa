import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { FeatureToggleDirective } from 'ish-core/directives/feature-toggle.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { AddressComponent } from 'ish-shared/components/address/address/address.component';
import { BasketBuyerComponent } from 'ish-shared/components/basket/basket-buyer/basket-buyer.component';
import { BasketCostSummaryComponent } from 'ish-shared/components/basket/basket-cost-summary/basket-cost-summary.component';
import { CamfilCheckoutBucketComponent } from 'ish-shared/components/camfil-checkout-bucket/camfil-checkout-bucket.component';
import { CamfilCheckoutLineItemComponent } from 'ish-shared/components/camfil-checkout-line-item/camfil-checkout-line-item.component';
import { CamfilCheckoutSummaryComponent } from 'ish-shared/components/camfil-checkout-summary/camfil-checkout-summary.component';
import { CamfilShoppingBucketEmptyComponent } from 'ish-shared/components/camfil-shopping-bucket-empty/camfil-shopping-bucket-empty.component';
import { CamfilInfoBoxComponent } from 'ish-shared/components/common/camfil-info-box/camfil-info-box.component';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';

import { CamfilCheckoutReceiptComponent } from './camfil-checkout-receipt.component';

describe('Camfil Checkout Receipt Component', () => {
  let component: CamfilCheckoutReceiptComponent;
  let fixture: ComponentFixture<CamfilCheckoutReceiptComponent>;
  let element: HTMLElement;
  let accountFacadeMock: AccountFacade;

  beforeEach(async () => {
    accountFacadeMock = mock(AccountFacade);

    await TestBed.configureTestingModule({
      declarations: [
        CamfilCheckoutReceiptComponent,
        MockComponent(AddressComponent),
        MockComponent(BasketBuyerComponent),
        MockComponent(BasketCostSummaryComponent),
        MockComponent(CamfilCheckoutLineItemComponent),
        MockComponent(CamfilInfoBoxComponent),
        MockComponent(FaIconComponent),
        MockComponent(InfoBoxComponent),
        MockDirective(CamfilCheckoutBucketComponent),
        MockDirective(CamfilCheckoutSummaryComponent),
        MockDirective(CamfilShoppingBucketEmptyComponent),
        MockDirective(FeatureToggleDirective),
      ],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacadeMock) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilCheckoutReceiptComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.order = BasketMockData.getOrder();
    when(accountFacadeMock.isLoggedIn$).thenReturn(of(false));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

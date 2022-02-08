import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { LazyCamRequisitionCheckoutButtonComponent } from 'src/app/extensions/cam-requisition-management/exports/lazy-cam-requisition-checkout-button/lazy-cam-requisition-checkout-button.component';
import { instance, mock, when } from 'ts-mockito';

import { AuthorizationToggleDirective } from 'ish-core/directives/authorization-toggle.directive';
import { NotAuthorizationToggleDirective } from 'ish-core/directives/not-authorization-toggle.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { CamfilSlugifyPipe } from 'ish-core/pipes/camfil-slugify.pipe';
import { ConfigurationService } from 'ish-core/services/configuration/configuration.service';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { BasketPromotionComponent } from 'ish-shared/components/basket/basket-promotion/basket-promotion.component';
import { CamfilModalDialogComponent } from 'ish-shared/components/common/camfil-modal-dialog/camfil-modal-dialog.component';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';

import { ChannelToggleDirective } from '../../../extensions/cam-configuration/directives/channel-toggle.directive';
import { CamConfigurationFacade } from '../../../extensions/cam-configuration/facades/cam-configuration.facade';

import { CamfilCheckoutSummaryComponent } from './camfil-checkout-summary.component';

describe('Camfil Checkout Summary Component', () => {
  let component: CamfilCheckoutSummaryComponent;
  let fixture: ComponentFixture<CamfilCheckoutSummaryComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;
  let checkoutFacade: CheckoutFacade;
  let shoppingFacade: ShoppingFacade;
  let camConfFacade: CamConfigurationFacade;
  let configurationServiceMock: ConfigurationService;

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);
    checkoutFacade = mock(CheckoutFacade);
    shoppingFacade = mock(ShoppingFacade);
    camConfFacade = mock(CamConfigurationFacade);
    configurationServiceMock = mock(ConfigurationService);

    await TestBed.configureTestingModule({
      declarations: [
        CamfilCheckoutSummaryComponent,
        CamfilSmallCtaModalComponent,
        MockComponent(BasketPromotionComponent),
        MockComponent(CamfilModalDialogComponent),
        MockComponent(ContentIncludeComponent),
        MockComponent(LazyCamRequisitionCheckoutButtonComponent),
        MockDirective(AuthorizationToggleDirective),
        MockDirective(ChannelToggleDirective),
        MockDirective(NotAuthorizationToggleDirective),
        MockPipe(CamfilSlugifyPipe),
        MockPipe(PricePipe),
      ],
      imports: [RouterTestingModule],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
        { provide: CamConfigurationFacade, useFactory: () => instance(camConfFacade) },
        { provide: ConfigurationService, useFactory: () => instance(configurationServiceMock) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilCheckoutSummaryComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.totals = BasketMockData.getTotals();

    when(accountFacade.userPriceDisplayType$).thenReturn(of('net'));
    when(checkoutFacade.basketValidationResults$).thenReturn(
      of({
        valid: false,
        adjusted: false,
      })
    );
    when(shoppingFacade.productsReadyToPlaceOrder$).thenReturn(of(true));
    when(accountFacade.isLoggedIn$).thenReturn(of(false));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

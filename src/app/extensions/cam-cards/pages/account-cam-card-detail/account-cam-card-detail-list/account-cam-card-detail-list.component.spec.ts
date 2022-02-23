import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CamfilConfigurationFacade } from 'camfil-pwa/facades/camfil-configuration.facade';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { CamfilLoadingComponent } from 'ish-shared/components/common/camfil-loading/camfil-loading.component';
import { CamfilModalDialogComponent } from 'ish-shared/components/common/camfil-modal-dialog/camfil-modal-dialog.component';
import { CamfilProductAddToBasketComponent } from 'ish-shared/components/product/camfil-product-add-to-basket/camfil-product-add-to-basket.component';

import { CamCard } from '../../../models/cam-card/cam-card.model';
import { CamCardProductCommentComponent } from '../../../shared/cam-card-product-comment/cam-card-product-comment.component';
import { AccountCamCardDetailLineItemComponent } from '../account-cam-card-detail-line-item/account-cam-card-detail-line-item.component';
import { AccountCamCardDetailSubTitleComponent } from '../account-cam-card-detail-sub-title/account-cam-card-detail-sub-title.component';
import { AccountCamCardDetailToolbarComponent } from '../account-cam-card-detail-toolbar/account-cam-card-detail-toolbar.component';

import { AccountCamCardDetailListComponent } from './account-cam-card-detail-list.component';

describe('Account Cam Card Detail List Component', () => {
  let component: AccountCamCardDetailListComponent;
  let fixture: ComponentFixture<AccountCamCardDetailListComponent>;
  let element: HTMLElement;
  let shoppingFacadeMock: ShoppingFacade;
  let camfilConfigurationFacadeMock: CamfilConfigurationFacade;

  const camCard: CamCard = {
    name: 'testing cam cards',
    id: '.SKsEQAE4FIAAAFuNiUBWx0d',
    itemsCount: 1,
    customer: {
      customerNo: 'no12345',
      id: '12345',
      parent: false,
    },
    camCardItems: [
      {
        id: '12345',
        quantity: 1,
        creationDate: 123124125,
        product: {
          sku: '1234',
        },
      },
    ],
  };

  beforeEach(async () => {
    shoppingFacadeMock = mock(ShoppingFacade);
    camfilConfigurationFacadeMock = mock(CamfilConfigurationFacade);
    await TestBed.configureTestingModule({
      declarations: [
        AccountCamCardDetailListComponent,
        MockComponent(AccountCamCardDetailLineItemComponent),
        MockComponent(AccountCamCardDetailSubTitleComponent),
        MockComponent(AccountCamCardDetailToolbarComponent),
        MockComponent(CamCardProductCommentComponent),
        MockComponent(CamfilLoadingComponent),
        MockComponent(CamfilModalDialogComponent),
        MockComponent(CamfilProductAddToBasketComponent),
        MockComponent(FaIconComponent),
        MockPipe(DatePipe),
        MockPipe(PricePipe),
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: CamfilConfigurationFacade, useFactory: () => instance(camfilConfigurationFacadeMock) },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacadeMock) },
        provideMockStore({}),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountCamCardDetailListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(shoppingFacadeMock.basketAddresses$).thenReturn(of([]));
    when(camfilConfigurationFacadeMock.isEnabled$('preventCamCardERPIdValidation')).thenReturn(of(false));
  });

  it('should be created', () => {
    component.camCard = camCard;
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

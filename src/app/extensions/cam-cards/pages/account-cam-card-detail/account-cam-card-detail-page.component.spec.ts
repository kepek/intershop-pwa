import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CamfilShoppingFacade } from 'camfil-pwa/facades/camfil-shopping.facade';
import { MockComponent } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CamfilErrorMessageComponent } from 'ish-shared/components/common/camfil-error-message/camfil-error-message.component';
import { CamfilLoadingComponent } from 'ish-shared/components/common/camfil-loading/camfil-loading.component';
import { CamfilProductAddToBasketComponent } from 'ish-shared/components/product/camfil-product-add-to-basket/camfil-product-add-to-basket.component';

import { CamCardsFacade } from '../../facades/cam-cards.facade';
import { CamCardPreferencesDialogComponent } from '../../shared/cam-card-preferences-dialog/cam-card-preferences-dialog.component';
import { CamCardPreferencesComponent } from '../../shared/cam-card-preferences/cam-card-preferences.component';
import { CamCardProductCommentComponent } from '../../shared/cam-card-product-comment/cam-card-product-comment.component';

import { AccountCamCardDetailLineItemComponent } from './account-cam-card-detail-line-item/account-cam-card-detail-line-item.component';
import { AccountCamCardDetailListComponent } from './account-cam-card-detail-list/account-cam-card-detail-list.component';
import { AccountCamCardDetailPageComponent } from './account-cam-card-detail-page.component';

describe('Account Cam Card Detail Page Component', () => {
  let component: AccountCamCardDetailPageComponent;
  let fixture: ComponentFixture<AccountCamCardDetailPageComponent>;
  let element: HTMLElement;
  let appFacade: AppFacade;
  let shoppingFacade: CamfilShoppingFacade;

  beforeEach(async () => {
    const camCardsFacade = mock(CamCardsFacade);
    when(camCardsFacade.currentCamCard$).thenReturn(EMPTY);

    appFacade = mock(AppFacade);
    shoppingFacade = mock(CamfilShoppingFacade);
    when(appFacade.headerType$).thenReturn(of(undefined));
    when(shoppingFacade.productsLoading$).thenReturn(of(false));

    await TestBed.configureTestingModule({
      imports: [NgbPopoverModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        AccountCamCardDetailPageComponent,
        MockComponent(AccountCamCardDetailLineItemComponent),
        MockComponent(AccountCamCardDetailListComponent),
        MockComponent(CamCardPreferencesComponent),
        MockComponent(CamCardPreferencesDialogComponent),
        MockComponent(CamCardProductCommentComponent),
        MockComponent(CamfilErrorMessageComponent),
        MockComponent(CamfilLoadingComponent),
        MockComponent(CamfilProductAddToBasketComponent),
        MockComponent(FaIconComponent),
      ],
      providers: [
        { provide: CamCardsFacade, useFactory: () => instance(camCardsFacade) },
        { provide: CamfilShoppingFacade, useFactory: () => instance(shoppingFacade) },
        { provide: AppFacade, useFactory: () => instance(appFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountCamCardDetailPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { CamfilProductAddToBasketComponent } from 'ish-shared/components/product/camfil-product-add-to-basket/camfil-product-add-to-basket.component';

import { CamCardsFacade } from '../../facades/cam-cards.facade';
import { CamCardPreferencesDialogComponent } from '../../shared/cam-card-preferences-dialog/cam-card-preferences-dialog.component';

import { AccountCamCardDetailLineItemComponent } from './account-cam-card-detail-line-item/account-cam-card-detail-line-item.component';
import { AccountCamCardDetailPageComponent } from './account-cam-card-detail-page.component';

describe('Account Cam Card Detail Page Component', () => {
  let component: AccountCamCardDetailPageComponent;
  let fixture: ComponentFixture<AccountCamCardDetailPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const camCardsFacade = mock(CamCardsFacade);
    when(camCardsFacade.currentCamCard$).thenReturn(EMPTY);

    await TestBed.configureTestingModule({
      imports: [NgbPopoverModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        AccountCamCardDetailPageComponent,
        MockComponent(AccountCamCardDetailLineItemComponent),
        MockComponent(CamCardPreferencesDialogComponent),
        MockComponent(CamfilProductAddToBasketComponent),
        MockComponent(ErrorMessageComponent),
        MockComponent(FaIconComponent),
        MockComponent(LoadingComponent),
      ],
      providers: [
        { provide: CamCardsFacade, useFactory: () => instance(camCardsFacade) },
        { provide: ShoppingFacade, useFactory: () => instance(mock(ShoppingFacade)) },
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

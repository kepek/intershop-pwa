import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { ModalAddNewProductComponent } from 'src/app/extensions/cam-cards/pages/account-cam-card-detail/modal-add-new-product/modal-add-new-product.component';
import { ArticleDetailsComponent } from 'src/app/extensions/cam-cards/shared/add-product-to-cam-card-modal/article-details/article-details.component';
import { instance, mock, when } from 'ts-mockito';

import { CamfilMaxLengthAttributeCreateDirective } from 'ish-core/directives/camfil-max-length-attribute-create.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { AddressComponent } from 'ish-shared/components/address/address/address.component';
import { BasketCostSummaryComponent } from 'ish-shared/components/basket/basket-cost-summary/basket-cost-summary.component';
import { CamfilBasketCostSummaryComponent } from 'ish-shared/components/basket/camfil-basket-cost-summary/camfil-basket-cost-summary.component';
import { CamfilMyPageHeaderComponent } from 'ish-shared/components/camfil-my-page-header/camfil-my-page-header.component';
import { CamfilErrorMessageComponent } from 'ish-shared/components/common/camfil-error-message/camfil-error-message.component';
import { CamfilLoadingComponent } from 'ish-shared/components/common/camfil-loading/camfil-loading.component';
import { CamfilModalDialogComponent } from 'ish-shared/components/common/camfil-modal-dialog/camfil-modal-dialog.component';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';
import { LineItemListComponent } from 'ish-shared/components/line-item/line-item-list/line-item-list.component';
import { CamfilProductQuantityComponent } from 'ish-shared/components/product/camfil-product-quantity/camfil-product-quantity.component';

import { CamfilRequisitionDetailToolbarComponent } from '../../components/camfil-requisition-detail-toolbar/camfil-requisition-detail-toolbar.component';
import { CamfilRequisitionLineItemTableComponent } from '../../components/camfil-requisition-line-item-table/camfil-requisition-line-item-table.component';
import { CamfilRequisitionRejectDialogComponent } from '../../components/camfil-requisition-reject-dialog/camfil-requisition-reject-dialog.component';
import { CamfilRequisitionSummaryComponent } from '../../components/camfil-requisition-summary/camfil-requisition-summary.component';
import { CamfilRequisitionContextFacade } from '../../facades/cam-requisition-context.facade';

import { RequisitionDetailPageComponent } from './requisition-detail-page.component';

describe('Requisition Detail Page Component', () => {
  let component: RequisitionDetailPageComponent;
  let fixture: ComponentFixture<RequisitionDetailPageComponent>;
  let element: HTMLElement;
  let context: CamfilRequisitionContextFacade;
  let appFacade: AppFacade;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    context = mock(CamfilRequisitionContextFacade);
    appFacade = mock(AppFacade);
    accountFacade = mock(AccountFacade);
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        ArticleDetailsComponent,
        CamfilMaxLengthAttributeCreateDirective,
        MockComponent(AddressComponent),
        MockComponent(BasketCostSummaryComponent),
        MockComponent(CamfilBasketCostSummaryComponent),
        MockComponent(CamfilErrorMessageComponent),
        MockComponent(CamfilLoadingComponent),
        MockComponent(CamfilModalDialogComponent),
        MockComponent(CamfilMyPageHeaderComponent),
        MockComponent(CamfilProductQuantityComponent),
        MockComponent(CamfilRequisitionDetailToolbarComponent),
        MockComponent(CamfilRequisitionLineItemTableComponent),
        MockComponent(CamfilRequisitionRejectDialogComponent),
        MockComponent(CamfilRequisitionSummaryComponent),
        MockComponent(FaIconComponent),
        MockComponent(InfoBoxComponent),
        MockComponent(LineItemListComponent),
        ModalAddNewProductComponent,
        RequisitionDetailPageComponent,
      ],
    })
      .overrideComponent(RequisitionDetailPageComponent, {
        set: {
          providers: [
            { provide: CamfilRequisitionContextFacade, useFactory: () => instance(context) },
            { provide: AppFacade, useFactory: () => instance(appFacade) },
            { provide: AccountFacade, useFactory: () => instance(accountFacade) },
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitionDetailPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(context.select('entity')).thenReturn(of());
    when(context.select('view')).thenReturn(of('approver'));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

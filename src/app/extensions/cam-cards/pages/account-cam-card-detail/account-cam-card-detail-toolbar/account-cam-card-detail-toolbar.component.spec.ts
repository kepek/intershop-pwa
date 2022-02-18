import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { CamRequisitionManagementFacade } from 'src/app/extensions/cam-requisition-management/facades/cam-requisition-management.facade';
import { instance, mock } from 'ts-mockito';

import { CamfilMaxLengthAttributeCreateDirective } from 'ish-core/directives/camfil-max-length-attribute-create.directive';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { CamfilLoadingComponent } from 'ish-shared/components/common/camfil-loading/camfil-loading.component';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';
import { CamfilProductQuantityComponent } from 'ish-shared/components/product/camfil-product-quantity/camfil-product-quantity.component';
import { CamfilCounterComponent } from 'ish-shared/forms/components/camfil-counter/camfil-counter.component';

import { ArticleDetailsComponent } from '../../../shared/add-product-to-cam-card-modal/article-details/article-details.component';
import { CamCardPreferencesDialogComponent } from '../../../shared/cam-card-preferences-dialog/cam-card-preferences-dialog.component';
import { ModalAddNewProductComponent } from '../modal-add-new-product/modal-add-new-product.component';
import { ModalAddNewSectionComponent } from '../modal-add-new-section/modal-add-new-section.component';

import { AccountCamCardDetailToolbarComponent } from './account-cam-card-detail-toolbar.component';

describe('Account Cam Card Detail Toolbar Component', () => {
  let component: AccountCamCardDetailToolbarComponent;
  let fixture: ComponentFixture<AccountCamCardDetailToolbarComponent>;
  let element: HTMLElement;
  let camRequisitionManagementFacade: CamRequisitionManagementFacade;

  beforeEach(async () => {
    camRequisitionManagementFacade = mock(CamRequisitionManagementFacade);
    await TestBed.configureTestingModule({
      declarations: [
        AccountCamCardDetailToolbarComponent,
        ArticleDetailsComponent,
        CamfilCounterComponent,
        CamfilErrorComponent,
        CamfilMaxLengthAttributeCreateDirective,
        CamfilProductQuantityComponent,
        MockComponent(CamCardPreferencesDialogComponent),
        MockComponent(CamfilLoadingComponent),
        MockComponent(CamfilSmallCtaModalComponent),
        ModalAddNewProductComponent,
        ModalAddNewSectionComponent,
      ],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: CamRequisitionManagementFacade, useFactory: () => instance(camRequisitionManagementFacade) },
        provideMockStore(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountCamCardDetailToolbarComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

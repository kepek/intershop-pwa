import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { CamCardsFacade } from 'src/app/extensions/cam-cards/facades/cam-cards.facade';
import { ModalAddNewProductComponent } from 'src/app/extensions/cam-cards/pages/account-cam-card-detail/modal-add-new-product/modal-add-new-product.component';
import { instance, mock } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { CamfilLoadingComponent } from 'ish-shared/components/common/camfil-loading/camfil-loading.component';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';
import { CamfilProductQuantityComponent } from 'ish-shared/components/product/camfil-product-quantity/camfil-product-quantity.component';

import { CamRequisitionManagementFacade } from '../../facades/cam-requisition-management.facade';

import { CamfilRequisitionDetailToolbarComponent } from './camfil-requisition-detail-toolbar.component';

describe('Camfil Requisition Detail Toolbar Component', () => {
  let component: CamfilRequisitionDetailToolbarComponent;
  let fixture: ComponentFixture<CamfilRequisitionDetailToolbarComponent>;
  let element: HTMLElement;
  let shoppingfacade: ShoppingFacade;
  let camCardsFacade: CamCardsFacade;
  let camRequisitionManagementFacade: CamRequisitionManagementFacade;

  beforeEach(async () => {
    shoppingfacade = mock(ShoppingFacade);
    camCardsFacade = mock(CamCardsFacade);
    camRequisitionManagementFacade = mock(CamRequisitionManagementFacade);
    await TestBed.configureTestingModule({
      declarations: [
        CamfilRequisitionDetailToolbarComponent,
        CamfilSmallCtaModalComponent,
        MockComponent(CamfilLoadingComponent),
        MockComponent(CamfilProductQuantityComponent),
        ModalAddNewProductComponent,
      ],
    })
      .overrideComponent(CamfilRequisitionDetailToolbarComponent, {
        set: {
          providers: [
            { provide: ShoppingFacade, useFactory: () => instance(shoppingfacade) },
            { provide: CamCardsFacade, useFactory: () => instance(camCardsFacade) },
            { provide: CamRequisitionManagementFacade, useFactory: () => instance(camRequisitionManagementFacade) },
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilRequisitionDetailToolbarComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

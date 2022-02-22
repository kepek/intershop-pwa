import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { OrderFormComponent } from 'src/app/extensions/cam-cards/shared/add-product-to-cart-modal/create-order-product-modal/order-form/order-form.component';
import { instance, mock } from 'ts-mockito';

import { CamRequisitionManagementFacade } from '../../../facades/cam-requisition-management.facade';

import { EditApprovalDetailsModalComponent } from './edit-approval-details-modal.component';

describe('Edit Approval Details Modal Component', () => {
  let component: EditApprovalDetailsModalComponent;
  let fixture: ComponentFixture<EditApprovalDetailsModalComponent>;
  let element: HTMLElement;
  let camRequisitionManagementFacade: CamRequisitionManagementFacade;

  beforeEach(async () => {
    camRequisitionManagementFacade = mock(CamRequisitionManagementFacade);
    await TestBed.configureTestingModule({
      declarations: [EditApprovalDetailsModalComponent, MockComponent(OrderFormComponent)],
      providers: [
        { provide: CamRequisitionManagementFacade, useFactory: () => instance(camRequisitionManagementFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditApprovalDetailsModalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

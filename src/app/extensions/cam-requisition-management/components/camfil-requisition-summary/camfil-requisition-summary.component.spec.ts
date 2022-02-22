import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { OrderFormComponent } from 'src/app/extensions/cam-cards/shared/add-product-to-cart-modal/create-order-product-modal/order-form/order-form.component';
import { instance, mock } from 'ts-mockito';

import { CamfilMaxLengthAttributeCreateDirective } from 'ish-core/directives/camfil-max-length-attribute-create.directive';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { CamfilToastrService } from 'ish-core/store/core/messages/CamfilToastrService';
import { CamfilAddressComponent } from 'ish-shared/components/camfil-address/camfil-address.component';

import { CamRequisitionManagementFacade } from '../../facades/cam-requisition-management.facade';
import { Requisition } from '../../models/camfil-requisition/camfil-requisition.model';

import { CamfilRequisitionSummaryComponent } from './camfil-requisition-summary.component';
import { EditApprovalDetailsModalComponent } from './edit-approval-details-modal/edit-approval-details-modal.component';

describe('Camfil Requisition Summary Component', () => {
  let component: CamfilRequisitionSummaryComponent;
  let fixture: ComponentFixture<CamfilRequisitionSummaryComponent>;
  let element: HTMLElement;
  let camRequisitionManagementFacade: CamRequisitionManagementFacade;
  let translate: TranslateService;
  let toastrServiceMock: CamfilToastrService;

  beforeEach(async () => {
    toastrServiceMock = mock(CamfilToastrService);
    camRequisitionManagementFacade = mock(CamRequisitionManagementFacade);
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        CamfilAddressComponent,
        CamfilMaxLengthAttributeCreateDirective,
        CamfilRequisitionSummaryComponent,
        EditApprovalDetailsModalComponent,
        MockComponent(OrderFormComponent),
        MockPipe(DatePipe),
        MockPipe(PricePipe),
      ],
      providers: [
        { provide: CamRequisitionManagementFacade, useFactory: () => instance(camRequisitionManagementFacade) },
        { provide: CamfilToastrService, useFactory: () => instance(toastrServiceMock) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilRequisitionSummaryComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');

    component.requisition = {
      id: '4711',
      requisitionNo: '4712',
      approval: {
        status: 'Approval Pending',
        statusCode: 'PENDING',
        customerApprovers: [
          { firstName: 'Jack', lastName: 'Link' },
          { firstName: 'Bernhhard', lastName: 'Boldner' },
        ],
      },
      user: { firstName: 'Patricia', lastName: 'Miller' },
      totals: undefined,
      creationDate: 24324321,
      lineItemCount: 2,
      lineItems: undefined,
    } as Requisition;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

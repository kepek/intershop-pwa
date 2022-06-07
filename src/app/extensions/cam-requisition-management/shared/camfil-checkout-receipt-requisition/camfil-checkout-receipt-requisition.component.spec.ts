import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { BasketApprovalInfoComponent } from 'ish-shared/components/basket/basket-approval-info/basket-approval-info.component';

import { CamRequisitionManagementFacade } from '../../facades/cam-requisition-management.facade';
import { CamfilRequisition } from '../../models/camfil-requisition/camfil-requisition.model';

import { CamfilCheckoutReceiptRequisitionComponent } from './camfil-checkout-receipt-requisition.component';

describe('Camfil Checkout Receipt Requisition Component', () => {
  let component: CamfilCheckoutReceiptRequisitionComponent;
  let fixture: ComponentFixture<CamfilCheckoutReceiptRequisitionComponent>;
  let element: HTMLElement;
  let reqFacade: CamRequisitionManagementFacade;

  beforeEach(async () => {
    reqFacade = mock(CamRequisitionManagementFacade);
    await TestBed.configureTestingModule({
      declarations: [
        CamfilCheckoutReceiptRequisitionComponent,
        MockComponent(BasketApprovalInfoComponent),
        MockDirective(ServerHtmlDirective),
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilCheckoutReceiptRequisitionComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.basket = BasketMockData.getBasket();

    when(reqFacade.requisition$(component.basket.id)).thenReturn(of({ requisitionNo: 'req001' } as CamfilRequisition));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the document number after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id="requisition-number"]').innerHTML.trim()).toContain('req001');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';

import { CamRequisitionManagementFacade } from '../../facades/cam-requisition-management.facade';

import { CamRequisitionCheckoutButtonComponent } from './cam-requisition-checkout-button.component';

describe('Cam Requisition Checkout Button Component', () => {
  let component: CamRequisitionCheckoutButtonComponent;
  let fixture: ComponentFixture<CamRequisitionCheckoutButtonComponent>;
  let element: HTMLElement;
  let camRequisitionManagementFacade: CamRequisitionManagementFacade;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);
    camRequisitionManagementFacade = mock(CamRequisitionManagementFacade);
    await TestBed.configureTestingModule({
      declarations: [CamRequisitionCheckoutButtonComponent],
    })
      .overrideComponent(CamRequisitionCheckoutButtonComponent, {
        set: {
          providers: [
            { provide: CamRequisitionManagementFacade, useFactory: () => instance(camRequisitionManagementFacade) },
            { provide: AccountFacade, useFactory: () => instance(accountFacade) },
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamRequisitionCheckoutButtonComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

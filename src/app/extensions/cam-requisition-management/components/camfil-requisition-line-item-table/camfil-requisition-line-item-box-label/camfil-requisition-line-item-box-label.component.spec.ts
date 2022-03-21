import { ComponentFixture, TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { CamfilMaxLengthAttributeCreateDirective } from 'ish-core/directives/camfil-max-length-attribute-create.directive';

import { CamRequisitionManagementFacade } from '../../../facades/cam-requisition-management.facade';

import { CamfilRequisitionLineItemBoxLabelComponent } from './camfil-requisition-line-item-box-label.component';

describe('Camfil Requisition Line Item Box Label Component', () => {
  let component: CamfilRequisitionLineItemBoxLabelComponent;
  let fixture: ComponentFixture<CamfilRequisitionLineItemBoxLabelComponent>;
  let element: HTMLElement;
  let camRequisitionManagementFacade: CamRequisitionManagementFacade;

  beforeEach(async () => {
    camRequisitionManagementFacade = mock(CamRequisitionManagementFacade);
    await TestBed.configureTestingModule({
      declarations: [CamfilMaxLengthAttributeCreateDirective, CamfilRequisitionLineItemBoxLabelComponent],
      providers: [
        { provide: CamRequisitionManagementFacade, useFactory: () => instance(camRequisitionManagementFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilRequisitionLineItemBoxLabelComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

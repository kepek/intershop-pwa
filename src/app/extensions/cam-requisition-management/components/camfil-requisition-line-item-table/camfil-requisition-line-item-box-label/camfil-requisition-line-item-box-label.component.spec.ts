import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamfilMaxLengthAttributeCreateDirective } from 'ish-core/directives/camfil-max-length-attribute-create.directive';

import { CamfilRequisitionLineItemBoxLabelComponent } from './camfil-requisition-line-item-box-label.component';

describe('Camfil Requisition Line Item Box Label Component', () => {
  let component: CamfilRequisitionLineItemBoxLabelComponent;
  let fixture: ComponentFixture<CamfilRequisitionLineItemBoxLabelComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilMaxLengthAttributeCreateDirective, CamfilRequisitionLineItemBoxLabelComponent],
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

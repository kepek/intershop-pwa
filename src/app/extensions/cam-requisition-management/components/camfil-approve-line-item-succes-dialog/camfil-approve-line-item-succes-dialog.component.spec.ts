import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { CamfilApproveLineItemSuccesDialogComponent } from './camfil-approve-line-item-succes-dialog.component';

describe('Camfil Approve Line Item Succes Dialog Component', () => {
  let component: CamfilApproveLineItemSuccesDialogComponent;
  let fixture: ComponentFixture<CamfilApproveLineItemSuccesDialogComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilApproveLineItemSuccesDialogComponent],
      imports: [NgbModalModule, RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilApproveLineItemSuccesDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

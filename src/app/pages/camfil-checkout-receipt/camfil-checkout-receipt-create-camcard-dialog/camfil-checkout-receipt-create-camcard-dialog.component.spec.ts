import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { CamfilCheckoutReceiptCreateCamCardDialogComponent } from './camfil-checkout-receipt-create-camcard-dialog.component';

describe('Camfil Checkout Receipt Create Camcard Dialog Component', () => {
  let component: CamfilCheckoutReceiptCreateCamCardDialogComponent;
  let fixture: ComponentFixture<CamfilCheckoutReceiptCreateCamCardDialogComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilCheckoutReceiptCreateCamCardDialogComponent],
      imports: [NgbModalModule, RouterTestingModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: [] },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilCheckoutReceiptCreateCamCardDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

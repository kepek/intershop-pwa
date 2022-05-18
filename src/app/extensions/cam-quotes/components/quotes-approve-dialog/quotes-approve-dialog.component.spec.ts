import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { QuotesApproveDialogComponent } from './quotes-approve-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

describe('Quotes Approve Dialog Component', () => {
  let component: QuotesApproveDialogComponent;
  let fixture: ComponentFixture<QuotesApproveDialogComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuotesApproveDialogComponent],
      imports: [NgbModalModule, RouterTestingModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: [] },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotesApproveDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

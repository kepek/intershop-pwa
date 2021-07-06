import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideMockStore } from '@ngrx/store/testing';
import { instance, mock } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';

import { AddEmailRecipientModalComponent } from './add-email-recipient-modal.component';

describe('Add Email Recipient Modal Component', () => {
  let component: AddEmailRecipientModalComponent;
  let fixture: ComponentFixture<AddEmailRecipientModalComponent>;
  let element: HTMLElement;
  let shoppingFacadeMock: ShoppingFacade;

  beforeEach(async () => {
    shoppingFacadeMock = mock(ShoppingFacade);
    await TestBed.configureTestingModule({
      declarations: [AddEmailRecipientModalComponent, CamfilErrorComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacadeMock) },
        provideMockStore(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmailRecipientModalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

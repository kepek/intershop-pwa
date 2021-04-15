import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideMockStore } from '@ngrx/store/testing';

import { AddEmailRecipientModalComponent } from './add-email-recipient-modal.component';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { instance, mock } from 'ts-mockito';

describe('Add email recipients modal Component', () => {
  let component: AddEmailRecipientModalComponent;
  let fixture: ComponentFixture<AddEmailRecipientModalComponent>;
  let element: HTMLElement;
  let shoppingFacadeMock: ShoppingFacade;

  beforeEach(async () => {
    shoppingFacadeMock = mock(ShoppingFacade);
    await TestBed.configureTestingModule({
      declarations: [AddEmailRecipientModalComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, bucket: {} },
        { provide: MatDialogRef, bucket: {} },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacadeMock) },
        provideMockStore(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmailRecipientModalComponent);
    component = fixture.componentInstance;
    component.bucket = { basket: 'test_basketId', id: 'text_id' };
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

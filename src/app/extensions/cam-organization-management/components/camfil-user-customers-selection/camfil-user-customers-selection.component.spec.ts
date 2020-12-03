import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { CamfilConfirmationModalComponent } from './camfil-confirmation-moda/camfil-confirmation-modal.component';
import { CamfilUserCustomerSelectionFormItemComponent } from './camfil-user-customer-selection-form-item/camfil-user-customer-selection-form-item.component';
import { CamfilUserCustomersSelectionComponent } from './camfil-user-customers-selection.component';

describe('Camfil User Customers Selection Component', () => {
  let component: CamfilUserCustomersSelectionComponent;
  let fixture: ComponentFixture<CamfilUserCustomersSelectionComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CamfilConfirmationModalComponent,
        CamfilUserCustomerSelectionFormItemComponent,
        CamfilUserCustomersSelectionComponent,
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilUserCustomersSelectionComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

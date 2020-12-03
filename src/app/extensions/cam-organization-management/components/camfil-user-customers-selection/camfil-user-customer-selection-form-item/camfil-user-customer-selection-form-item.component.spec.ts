import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';

import { CamfilUserCustomerSelectionFormItemComponent } from './camfil-user-customer-selection-form-item.component';

describe('Camfil User Customer Selection Form Item Component', () => {
  let component: CamfilUserCustomerSelectionFormItemComponent;
  let fixture: ComponentFixture<CamfilUserCustomerSelectionFormItemComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilUserCustomerSelectionFormItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilUserCustomerSelectionFormItemComponent);
    component = fixture.componentInstance;
    component.customerItemForm = new FormGroup({});
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

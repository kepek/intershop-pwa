import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { CamfilConfirmationModalComponent } from '../camfil-user-customers-selection/camfil-confirmation-moda/camfil-confirmation-modal.component';
import { CamfilUserCustomerSelectionFormItemComponent } from '../camfil-user-customers-selection/camfil-user-customer-selection-form-item/camfil-user-customer-selection-form-item.component';
import { CamfilUserCustomersSelectionComponent } from '../camfil-user-customers-selection/camfil-user-customers-selection.component';
import { CamfilUserPersonalFormComponent } from '../camfil-user-personal-form/camfil-user-personal-form.component';
import { CamfilUserRolesSelectionComponent } from '../camfil-user-roles-selection/camfil-user-roles-selection.component';

import { CamfilUserEditComponent } from './camfil-user-edit.component';

describe('Camfil User Edit Component', () => {
  let component: CamfilUserEditComponent;
  let fixture: ComponentFixture<CamfilUserEditComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CamfilConfirmationModalComponent,
        CamfilUserCustomerSelectionFormItemComponent,
        CamfilUserCustomersSelectionComponent,
        CamfilUserEditComponent,
        CamfilUserPersonalFormComponent,
        CamfilUserRolesSelectionComponent,
      ],
      providers: [provideMockStore()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilUserEditComponent);
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

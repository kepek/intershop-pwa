import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';

import { CamOrganizationManagementStoreModule } from '../../store/cam-organization-management-store.module';

import { CamfilOrganizationRolesNamesComponent } from './camfil-organization-roles-names.component';

describe('Camfil Organization Roles Names Component', () => {
  let component: CamfilOrganizationRolesNamesComponent;
  let fixture: ComponentFixture<CamfilOrganizationRolesNamesComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CamOrganizationManagementStoreModule.forTesting(),
        CoreStoreModule.forTesting(),
        CustomerStoreModule.forTesting('user'),
      ],
      declarations: [CamfilOrganizationRolesNamesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilOrganizationRolesNamesComponent);
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

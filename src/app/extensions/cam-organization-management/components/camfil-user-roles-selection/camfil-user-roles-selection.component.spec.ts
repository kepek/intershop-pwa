import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { CamfilConfirmationModalComponent } from '../camfil-user-customers-selection/camfil-confirmation-moda/camfil-confirmation-modal.component';

import { CamfilUserRolesSelectionComponent } from './camfil-user-roles-selection.component';

describe('Camfil User Roles Selection Component', () => {
  let component: CamfilUserRolesSelectionComponent;
  let fixture: ComponentFixture<CamfilUserRolesSelectionComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilConfirmationModalComponent, CamfilUserRolesSelectionComponent],
      // tslint:disable-next-line:no-intelligence-in-artifacts
      providers: [provideMockStore()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilUserRolesSelectionComponent);
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

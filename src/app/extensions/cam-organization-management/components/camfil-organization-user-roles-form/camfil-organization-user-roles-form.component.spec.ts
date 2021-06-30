import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockPipe } from 'ng-mocks';

import { CamfilSlugifyPipe } from 'ish-core/pipes/camfil-slugify.pipe';

import { CamfilOrganizationUserRolesFormComponent } from './camfil-organization-user-roles-form.component';

describe('Camfil Organization User Roles Form Component', () => {
  let component: CamfilOrganizationUserRolesFormComponent;
  let fixture: ComponentFixture<CamfilOrganizationUserRolesFormComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilOrganizationUserRolesFormComponent, MockPipe(CamfilSlugifyPipe)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilOrganizationUserRolesFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

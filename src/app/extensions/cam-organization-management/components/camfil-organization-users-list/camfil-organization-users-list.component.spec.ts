import { APP_BASE_HREF } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { MockComponent } from 'ng-mocks';

import { CamfilOrganizationRolesNamesComponent } from '../camfil-organization-roles-names/camfil-organization-roles-names.component';

import { CamfilOrganizationUsersListComponent } from './camfil-organization-users-list.component';

describe('Camfil Organization Users List Component', () => {
  let component: CamfilOrganizationUsersListComponent;
  let fixture: ComponentFixture<CamfilOrganizationUsersListComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      declarations: [CamfilOrganizationUsersListComponent, MockComponent(CamfilOrganizationRolesNamesComponent)],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilOrganizationUsersListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

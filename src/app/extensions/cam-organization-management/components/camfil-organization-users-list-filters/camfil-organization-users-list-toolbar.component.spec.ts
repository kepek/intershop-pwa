import { APP_BASE_HREF } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { CamfilOrganizationUsersListToolbarComponent } from './camfil-organization-users-list-toolbar.component';

describe('Camfil Organization Users List Toolbar Component', () => {
  let component: CamfilOrganizationUsersListToolbarComponent;
  let fixture: ComponentFixture<CamfilOrganizationUsersListToolbarComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      declarations: [CamfilOrganizationUsersListToolbarComponent],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilOrganizationUsersListToolbarComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

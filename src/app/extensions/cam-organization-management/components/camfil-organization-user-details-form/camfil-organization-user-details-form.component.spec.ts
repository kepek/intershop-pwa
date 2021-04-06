import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamfilOrganizationUserDetailsFormComponent } from './camfil-organization-user-details-form.component';

describe('Camfil Organization User Details Form Component', () => {
  let component: CamfilOrganizationUserDetailsFormComponent;
  let fixture: ComponentFixture<CamfilOrganizationUserDetailsFormComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilOrganizationUserDetailsFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilOrganizationUserDetailsFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

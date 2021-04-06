import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamfilOrganizationHeaderComponent } from './camfil-organization-header.component';

describe('Camfil Organization Header Component', () => {
  let component: CamfilOrganizationHeaderComponent;
  let fixture: ComponentFixture<CamfilOrganizationHeaderComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilOrganizationHeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilOrganizationHeaderComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

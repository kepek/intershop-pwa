import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamfilUserPersonalFormComponent } from './camfil-user-personal-form.component';

describe('Camfil User Personal Form Component', () => {
  let component: CamfilUserPersonalFormComponent;
  let fixture: ComponentFixture<CamfilUserPersonalFormComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilUserPersonalFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilUserPersonalFormComponent);
    element = fixture.nativeElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

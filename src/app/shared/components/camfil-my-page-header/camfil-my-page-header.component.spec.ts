import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamfilMyPageHeaderComponent } from './camfil-my-page-header.component';

describe('Camfil Organization Header Component', () => {
  let component: CamfilMyPageHeaderComponent;
  let fixture: ComponentFixture<CamfilMyPageHeaderComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilMyPageHeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilMyPageHeaderComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

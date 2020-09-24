import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { CamfilInfoSectionComponent } from './camfil-info-section.component';

describe('Camfil Info Component', () => {
  let component: CamfilInfoSectionComponent;
  let fixture: ComponentFixture<CamfilInfoSectionComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CamfilInfoSectionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilInfoSectionComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { CamfilFilterInfoComponent } from './camfil-filter-info.component';

describe('Camfil Filter Info Component', () => {
  let component: CamfilFilterInfoComponent;
  let fixture: ComponentFixture<CamfilFilterInfoComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CamfilFilterInfoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilFilterInfoComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

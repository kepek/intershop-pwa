import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamfilHeaderBoxComponent } from './camfil-header-box.component';

describe('Camfil Intro Component', () => {
  let component: CamfilHeaderBoxComponent;
  let fixture: ComponentFixture<CamfilHeaderBoxComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilHeaderBoxComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilHeaderBoxComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

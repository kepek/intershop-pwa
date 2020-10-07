import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamfilDetailsBoxComponent } from './camfil-details-box.component';

describe('Camfil Details Box Component', () => {
  let component: CamfilDetailsBoxComponent;
  let fixture: ComponentFixture<CamfilDetailsBoxComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilDetailsBoxComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilDetailsBoxComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

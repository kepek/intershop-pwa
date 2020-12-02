import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamfilProductQuickviewComponent } from './camfil-product-quickview.component';

describe('Camfil Product Quickview Component', () => {
  let component: CamfilProductQuickviewComponent;
  let fixture: ComponentFixture<CamfilProductQuickviewComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilProductQuickviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilProductQuickviewComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

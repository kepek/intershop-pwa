import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamfilLineItemMeasurementsComponent } from './camfil-line-item-measurements.component';

describe('Camfil Line Item Measurements Component', () => {
  let component: CamfilLineItemMeasurementsComponent;
  let fixture: ComponentFixture<CamfilLineItemMeasurementsComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilLineItemMeasurementsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilLineItemMeasurementsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

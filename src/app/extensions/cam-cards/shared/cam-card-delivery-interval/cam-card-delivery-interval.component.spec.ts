import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamCardDeliveryIntervalComponent } from './cam-card-delivery-interval.component';

describe('Cam Card Delivery Interval Component', () => {
  let component: CamCardDeliveryIntervalComponent;
  let fixture: ComponentFixture<CamCardDeliveryIntervalComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamCardDeliveryIntervalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamCardDeliveryIntervalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

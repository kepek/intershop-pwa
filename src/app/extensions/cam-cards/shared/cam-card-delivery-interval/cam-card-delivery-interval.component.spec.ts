import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CamfilConfigurationFacade } from 'camfil-pwa/facades/camfil-configuration.facade';
import { instance, mock } from 'ts-mockito';

import { CamCardsFacade } from '../../facades/cam-cards.facade';

import { CamCardDeliveryIntervalComponent } from './cam-card-delivery-interval.component';

describe('Cam Card Delivery Interval Component', () => {
  let component: CamCardDeliveryIntervalComponent;
  let fixture: ComponentFixture<CamCardDeliveryIntervalComponent>;
  let element: HTMLElement;
  let camfilConfigurationFacadeMock: CamfilConfigurationFacade;
  let camCardsFacadeMock: CamCardsFacade;

  beforeEach(async () => {
    camfilConfigurationFacadeMock = mock(CamfilConfigurationFacade);
    camCardsFacadeMock = mock(CamCardsFacade);
    await TestBed.configureTestingModule({
      declarations: [CamCardDeliveryIntervalComponent],
      providers: [
        { provide: CamfilConfigurationFacade, useFactory: () => instance(camfilConfigurationFacadeMock) },
        { provide: CamCardsFacade, useFactory: () => instance(camCardsFacadeMock) },
      ],
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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CamfilConfigurationFacade } from 'camfil-pwa/facades/camfil-configuration.facade';
import { instance, mock } from 'ts-mockito';

import { CamCardLastDeliveryDateComponent } from './cam-card-last-delivery-date.component';

describe('Cam Card Last Delivery Date Component', () => {
  let component: CamCardLastDeliveryDateComponent;
  let fixture: ComponentFixture<CamCardLastDeliveryDateComponent>;
  let element: HTMLElement;
  let camfilConfigurationFacadeMock: CamfilConfigurationFacade;

  beforeEach(async () => {
    camfilConfigurationFacadeMock = mock(CamfilConfigurationFacade);
    await TestBed.configureTestingModule({
      declarations: [CamCardLastDeliveryDateComponent],
      providers: [{ provide: CamfilConfigurationFacade, useFactory: () => instance(camfilConfigurationFacadeMock) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamCardLastDeliveryDateComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

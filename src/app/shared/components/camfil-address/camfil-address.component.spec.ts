import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { CamfilConfigurationFacade } from 'camfil-pwa/facades/camfil-configuration.facade';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { CamfilAddressComponent } from './camfil-address.component';

describe('Camfil Address Component', () => {
  let component: CamfilAddressComponent;
  let fixture: ComponentFixture<CamfilAddressComponent>;
  let element: HTMLElement;
  let configurationFacadeMock: CamfilConfigurationFacade;

  beforeEach(async () => {
    configurationFacadeMock = mock(CamfilConfigurationFacade);

    await TestBed.configureTestingModule({
      declarations: [CamfilAddressComponent],
      providers: [
        { provide: CamfilConfigurationFacade, useFactory: () => instance(configurationFacadeMock) },
        provideMockStore({}),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilAddressComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.address = BasketMockData.getAddress();
    when(configurationFacadeMock.channelCode$).thenReturn(of('SE'));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

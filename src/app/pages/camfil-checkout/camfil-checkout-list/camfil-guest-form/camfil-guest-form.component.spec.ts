import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CamConfigurationFacade } from 'src/app/extensions/cam-configuration/facades/cam-configuration.facade';
import { instance, mock } from 'ts-mockito';

import { CamfilMaxLengthAttributeCreateDirective } from 'ish-core/directives/camfil-max-length-attribute-create.directive';

import { CamfilGuestFormComponent } from './camfil-guest-form.component';

describe('Camfil Guest Form Component', () => {
  let component: CamfilGuestFormComponent;
  let fixture: ComponentFixture<CamfilGuestFormComponent>;
  let element: HTMLElement;
  let camConfigurationFacade: CamConfigurationFacade;

  beforeEach(async () => {
    camConfigurationFacade = mock(CamConfigurationFacade);
    await TestBed.configureTestingModule({
      declarations: [CamfilGuestFormComponent, CamfilMaxLengthAttributeCreateDirective],
      providers: [{ provide: CamConfigurationFacade, useFactory: () => instance(camConfigurationFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilGuestFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

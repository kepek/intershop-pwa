import { APP_BASE_HREF } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Locale } from 'ish-core/models/locale/locale.model';
import { MakeHrefPipe } from 'ish-core/pipes/make-href.pipe';

import { CamfilConfigurationFacade } from '../../../extensions/cam-configuration/facades/camfil-configuration.facade';
import { CamfilLang } from '../../../extensions/cam-configuration/models/channel-configuration/channel-configuration.model';

import { CamfilLanguageSwitchComponent } from './camfil-language-switch.component';

describe('Camfil Language Switch Component', () => {
  let component: CamfilLanguageSwitchComponent;
  let fixture: ComponentFixture<CamfilLanguageSwitchComponent>;
  let element: HTMLElement;
  let appFacade: AppFacade;
  let camConfigurationFacade: CamfilConfigurationFacade;

  const locales = [
    { lang: 'en_US', value: 'en', displayName: 'English' },
    { lang: 'de_DE', value: 'de', displayName: 'Deutsch' },
    { lang: 'fr_FR', value: 'fr', displayName: 'Fran¢aise' },
  ] as Locale[];

  const languages = ['en_US', 'de_DE'] as CamfilLang[];

  beforeEach(async () => {
    appFacade = mock(AppFacade);
    camConfigurationFacade = mock(CamfilConfigurationFacade);

    await TestBed.configureTestingModule({
      declarations: [CamfilLanguageSwitchComponent, MakeHrefPipe, MockComponent(FaIconComponent)],
      imports: [NgbDropdownModule, RouterTestingModule],
      providers: [
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: CamfilConfigurationFacade, useFactory: () => instance(camConfigurationFacade) },
        { provide: APP_BASE_HREF, useValue: '/' },
      ],
    }).compileComponents();

    when(appFacade.availableLocales$).thenReturn(of(locales));
    when(camConfigurationFacade.languages$).thenReturn(of(languages));
    when(appFacade.getChannel$).thenReturn(of('SEChannel'));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilLanguageSwitchComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    const router = TestBed.inject(Router);
    router.initialNavigation();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should show the available language options when rendered', () => {
    when(appFacade.currentLocale$).thenReturn(of(locales[1]));

    fixture.detectChanges();

    expect(element.querySelectorAll('.language-switch-link')).toHaveLength(1);
    expect(element.querySelector('.language-switch-current-selection').textContent).toMatchInlineSnapshot(
      `" Deutsch "`
    );
  });
});

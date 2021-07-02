import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';
import { CookiesBannerComponent } from 'ish-shell/application/cookies-banner/cookies-banner.component';
import { CamfilFooterComponent } from 'ish-shell/footer/camfil-footer/camfil-footer.component';
import { CamfilBreadcrumbComponent } from 'ish-shell/header/camfil-breadcrumb/camfil-breadcrumb.component';
import { CamfilHeaderComponent } from 'ish-shell/header/camfil-header/camfil-header.component';
import { CamfilIEModalComponent } from 'ish-shell/header/camfil-ie-modal/camfil-ie-modal.component';

import { AppComponent } from './app.component';

let translate: TranslateService;

describe('App Component', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    const cookiesServiceMock = mock(CookiesService);
    const statePropertiesServiceMock = mock(StatePropertiesService);
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MockComponent(CamfilBreadcrumbComponent),
        MockComponent(CamfilFooterComponent),
        MockComponent(CamfilHeaderComponent),
        MockComponent(CamfilIEModalComponent),
        MockComponent(CookiesBannerComponent),
      ],
      imports: [FeatureToggleModule.forTesting('recently'), RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: AppFacade, useFactory: () => instance(mock(AppFacade)) },
        { provide: CookiesService, useValue: instance(statePropertiesServiceMock) },
        { provide: StatePropertiesService, useValue: instance(cookiesServiceMock) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render header component on page', () => {
    expect(findAllCustomElements(element)).toContain('camfil-header');
  });
});

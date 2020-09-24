import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockDirective } from 'ng-mocks';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito';

import { AppComponent } from './app.component';
import { AppFacade } from 'ish-core/facades/app.facade';
import { CamfilFooterComponent } from './shell/footer/camfil-footer/camfil-footer.component';
import { CamfilHeaderComponent } from './shell/header/camfil-header/camfil-header.component';
import { NgxCookieBannerModule } from 'ngx-cookie-banner';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { findAllCamfilElements } from 'camfil';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';

let translate: TranslateService;

describe('App Component', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MockComponent(CamfilFooterComponent),
        MockComponent(CamfilHeaderComponent),
        MockDirective(ServerHtmlDirective),
      ],
      imports: [NgxCookieBannerModule.forRoot(), NoopAnimationsModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: AppFacade, useFactory: () => instance(mock(AppFacade)) }],
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
    expect(findAllCustomElements(element)).toContain('ish-header');
  });
});

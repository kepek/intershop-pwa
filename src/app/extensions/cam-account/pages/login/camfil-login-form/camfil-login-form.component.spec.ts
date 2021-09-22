import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CamfilErrorMessageComponent } from 'ish-shared/components/common/camfil-error-message/camfil-error-message.component';
import { CamfilHeaderBoxComponent } from 'ish-shared/components/common/camfil-header-box/camfil-header-box.component';

import { CamfilLoginFormComponent } from './camfil-login-form.component';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { CookiesService } from 'ngx-utils-cookies-port';

describe('Camfil Login Form Component', () => {
  let component: CamfilLoginFormComponent;
  let fixture: ComponentFixture<CamfilLoginFormComponent>;
  let element: HTMLElement;
  let translate: TranslateService;

  beforeEach(async () => {
    const cookiesServiceMock = mock(CookiesService);
    await TestBed.configureTestingModule({
      declarations: [CamfilHeaderBoxComponent, CamfilLoginFormComponent, MockComponent(CamfilErrorMessageComponent)],
      imports: [ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot(), BrowserTransferStateModule],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) },
        { provide: ApiTokenService, useFactory: () => instance(mock(ApiTokenService)) },
        { provide: CookiesService, useValue: instance(cookiesServiceMock) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilLoginFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

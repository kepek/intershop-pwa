import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';
import { CamfilLoadingComponent } from 'ish-shared/components/common/camfil-loading/camfil-loading.component';

import { CamfilLoginOnBehalfPageComponent } from './camfil-login-on-behalf-page.component';

describe('Camfil Login On Behalf Page Component', () => {
  let fixture: ComponentFixture<CamfilLoginOnBehalfPageComponent>;
  let component: CamfilLoginOnBehalfPageComponent;
  let element: HTMLElement;
  let translate: TranslateService;

  beforeEach(async () => {
    const cookiesServiceMock = mock(CookiesService);

    await TestBed.configureTestingModule({
      declarations: [CamfilLoginOnBehalfPageComponent, MockComponent(CamfilLoadingComponent)],
      imports: [
        BrowserTransferStateModule,
        CoreStoreModule.forTesting(),
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) },
        { provide: ApiTokenService, useFactory: () => instance(mock(ApiTokenService)) },
        { provide: CookiesService, useValue: instance(cookiesServiceMock) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilLoginOnBehalfPageComponent);
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

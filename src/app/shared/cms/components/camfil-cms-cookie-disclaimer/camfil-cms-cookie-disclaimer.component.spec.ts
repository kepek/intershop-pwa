import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockDirective } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { createContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';

import { CamfilCmsCookieDisclaimerComponent } from './camfil-cms-cookie-disclaimer.component';

describe('Camfil Cms Cookie Disclaimer Component', () => {
  let component: CamfilCmsCookieDisclaimerComponent;
  let fixture: ComponentFixture<CamfilCmsCookieDisclaimerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const cookiesServiceMock = mock(CookiesService);

    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, BrowserTransferStateModule, RouterTestingModule],
      declarations: [CamfilCmsCookieDisclaimerComponent, MockDirective(ServerHtmlDirective)],
      providers: [{ provide: CookiesService, useValue: instance(cookiesServiceMock) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilCmsCookieDisclaimerComponent);
    component = fixture.componentInstance;
    const pagelet = {
      definitionQualifiedName: 'fq',
      id: 'id',
      displayName: 'name',
      domain: 'domain',
      configurationParameters: {
        Image: 'http://example.net/foo/bar.png',
      },
    };
    component.pagelet = createContentPageletView(pagelet);
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

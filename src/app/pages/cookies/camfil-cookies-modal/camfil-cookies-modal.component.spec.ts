import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock, when } from 'ts-mockito';

import { COOKIE_CONSENT_OPTIONS } from 'ish-core/configurations/injection-keys';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';

import { CamfilCookiesModalComponent } from './camfil-cookies-modal.component';

// tslint:disable:no-intelligence-in-artifacts
describe('Cookies Modal Component', () => {
  let component: CamfilCookiesModalComponent;
  let fixture: ComponentFixture<CamfilCookiesModalComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const cookiesServiceMock = mock(CookiesService);
    when(cookiesServiceMock.get('cookieConsent')).thenReturn(
      JSON.stringify({ enabledOptions: ['required', 'functional'], version: 1 })
    );

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [CamfilCookiesModalComponent],
      providers: [
        {
          provide: COOKIE_CONSENT_OPTIONS,
          useValue: {
            options: [
              {
                id: 'required',
                name: 'required.name',
                description: 'required.description',
                required: true,
              },
              {
                id: 'functional',
                name: 'functional.name',
                description: 'functional.description',
              },
            ],
          },
        },
        { provide: CookiesService, useValue: instance(cookiesServiceMock) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilCookiesModalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

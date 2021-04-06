import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { CamfilHeaderDefaultComponent } from 'ish-shell/header/camfil-header-default/camfil-header-default.component';
import { HeaderCheckoutComponent } from 'ish-shell/header/header-checkout/header-checkout.component';
import { HeaderSimpleComponent } from 'ish-shell/header/header-simple/header-simple.component';

import { CamfilHeaderComponent } from './camfil-header.component';

describe('Camfil Header Component', () => {
  let component: CamfilHeaderComponent;
  let fixture: ComponentFixture<CamfilHeaderComponent>;
  let element: HTMLElement;
  let appFacade: AppFacade;

  beforeEach(async () => {
    appFacade = mock(AppFacade);
    when(appFacade.headerType$).thenReturn(of(undefined));

    await TestBed.configureTestingModule({
      imports: [FeatureToggleModule, RouterTestingModule],
      declarations: [
        CamfilHeaderComponent,
        MockComponent(CamfilHeaderDefaultComponent),
        MockComponent(HeaderCheckoutComponent),
        MockComponent(HeaderSimpleComponent),
      ],
      providers: [{ provide: AppFacade, useFactory: () => instance(appFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilHeaderComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render default header component if no headerType is set', () => {
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      Array [
        "camfil-header-default",
      ]
    `);
  });

  it('should render simple header component if set', () => {
    when(appFacade.headerType$).thenReturn(of('simple'));
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      Array [
        "ish-header-simple",
      ]
    `);
  });
});

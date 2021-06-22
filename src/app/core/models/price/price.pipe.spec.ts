import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { Locale } from 'ish-core/models/locale/locale.model';
import { PriceItem } from 'ish-core/models/price-item/price-item.model';
import {
  getAvailableLocales,
  getChannel,
  getCountryCodeByChannel,
  getCurrentLocale,
  getLang,
} from 'ish-core/store/core/configuration';
import { getUserPermissions } from 'ish-core/store/customer/authorization';

import { Price } from './price.model';
import { PricePipe } from './price.pipe';

describe('Price Pipe', () => {
  let fixture: ComponentFixture<DummyComponent>;
  let component: DummyComponent;
  let element: HTMLElement;
  let translateService: TranslateService;
  let accountFacade: AccountFacade;
  let appFacade: AppFacade;

  const locale = { currency: 'EUR', lang: 'de_DE', value: 'de' } as Locale;

  @Component({ template: '~{{ price | ishPrice }}~' })
  class DummyComponent {
    price: Price | PriceItem;
  }

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);
    appFacade = mock(AppFacade);

    when(accountFacade.userPriceDisplayType$).thenReturn(of('gross'));
    when(appFacade.getCurrencyByChannel$).thenReturn(of('EUR'));

    await TestBed.configureTestingModule({
      declarations: [DummyComponent, PricePipe],
      imports: [TranslateModule.forRoot()],
      providers: [
        provideMockStore({
          selectors: [
            { selector: getUserPermissions, value: ['APP_B2B_VIEW_PRICES'] },
            { selector: getChannel, value: 'Project-PageDE-Site' },
            { selector: getCountryCodeByChannel, value: 'DE' },
            { selector: getLang, value: 'de_DE' },
            { selector: getAvailableLocales, value: [locale] },
            { selector: getCurrentLocale, value: locale },
          ],
        }),
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: AppFacade, useFactory: () => instance(appFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    registerLocaleData(localeDe);
    translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    fixture = TestBed.createComponent(DummyComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display N/A for default', () => {
    translateService.use('en');
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`~product.price.na.text~`);
  });

  describe('Price', () => {
    const euroPrice: Price = {
      type: 'Money',
      value: 12391.98,
      currency: 'EUR',
    };

    const dollarPrice: Price = {
      type: 'Money',
      value: 24680.35,
      currency: 'USD',
    };

    it('should display dollar price for english', () => {
      component.price = dollarPrice;
      translateService.use('en');

      fixture.detectChanges();
      expect(element).toMatchInlineSnapshot(`~$24,680.35~`);
    });

    it('should display dollar price for german', () => {
      component.price = dollarPrice;
      translateService.use('de');

      fixture.detectChanges();
      expect(element).toMatchInlineSnapshot(`~24.680,35&nbsp;$~`);
    });

    it('should display euro price for english', () => {
      component.price = euroPrice;
      translateService.use('en');

      fixture.detectChanges();
      expect(element).toMatchInlineSnapshot(`~€12,391.98~`);
    });
    it('should display euro price for german', () => {
      component.price = euroPrice;
      translateService.use('de');

      fixture.detectChanges();
      expect(element).toMatchInlineSnapshot(`~12.391,98&nbsp;€~`);
    });
  });
});

describe('Price Pipe', () => {
  let fixture: ComponentFixture<DummyComponent>;
  let component: DummyComponent;
  let element: HTMLElement;
  let translateService: TranslateService;
  let accountFacade: AccountFacade;
  let appFacade: AppFacade;

  const locale = { currency: 'EUR', lang: 'de_DE', value: 'de' } as Locale;

  @Component({
    template: ` flex: {{ price | ishPrice }} pinned: {{ price | ishPrice: 'net' }} `,
  })
  class DummyComponent {
    price: Price | PriceItem;
  }

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);
    appFacade = mock(AppFacade);

    when(accountFacade.userPriceDisplayType$).thenReturn(of('gross'));
    when(appFacade.getCurrencyByChannel$).thenReturn(of('EUR'));

    await TestBed.configureTestingModule({
      declarations: [DummyComponent, PricePipe],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        provideMockStore({
          selectors: [
            { selector: getUserPermissions, value: ['APP_B2B_VIEW_PRICES'] },
            { selector: getChannel, value: 'Project-PageDE-Site' },
            { selector: getCountryCodeByChannel, value: 'DE' },
            { selector: getLang, value: 'de_DE' },
            { selector: getAvailableLocales, value: [locale] },
            { selector: getCurrentLocale, value: locale },
          ],
        }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    registerLocaleData(localeDe);
    translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    fixture = TestBed.createComponent(DummyComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('PriceItem', () => {
    const priceItem: PriceItem = {
      type: 'PriceItem',
      gross: 12391.98,
      net: 987.6,
      currency: 'USD',
    };

    beforeEach(() => {
      component.price = priceItem;
      translateService.use('en');
    });

    it('should display price depending on state', fakeAsync(() => {
      fixture.detectChanges();
      tick(500);

      expect(element).toMatchInlineSnapshot(`flex: $12,391.98 pinned: $987.60`);

      when(accountFacade.userPriceDisplayType$).thenReturn(of('net'));
      fixture.detectChanges();
      tick(500);

      expect(element).toMatchInlineSnapshot(`flex: $987.60 pinned: $987.60`);

      when(accountFacade.userPriceDisplayType$).thenReturn(of('gross'));
      fixture.detectChanges();
      tick(500);

      expect(element).toMatchInlineSnapshot(`flex: $12,391.98 pinned: $987.60`);
    }));

    it('should display price depending on input', fakeAsync(() => {
      fixture.detectChanges();
      tick(500);

      expect(element).toMatchInlineSnapshot(`flex: $12,391.98 pinned: $987.60`);

      component.price = { ...priceItem, gross: 123 };
      fixture.detectChanges();
      tick(500);

      expect(element).toMatchInlineSnapshot(`flex: $123.00 pinned: $987.60`);
    }));
  });
});

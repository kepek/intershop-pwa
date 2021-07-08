import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, capture, instance, mock, spy, verify, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { VariationProductView } from 'ish-core/models/product-view/product-view.model';
import { CamfilLoadingComponent } from 'ish-shared/components/common/camfil-loading/camfil-loading.component';
import { CamfilProductItemDetailedComponent } from 'ish-shared/components/product/camfil-product-item-detailed/camfil-product-item-detailed.component';
import { CamfilProductItemSimpleComponent } from 'ish-shared/components/product/camfil-product-item-simple/camfil-product-item-simple.component';

import { CamfilProductItemComponent } from './camfil-product-item.component';

describe('Camfil Product Item Component', () => {
  let component: CamfilProductItemComponent;
  let fixture: ComponentFixture<CamfilProductItemComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;
  let accountFacade: AccountFacade;
  let appFacade: AppFacade;

  beforeEach(async () => {
    shoppingFacade = mock(ShoppingFacade);
    accountFacade = mock(AccountFacade);
    appFacade = mock(AppFacade);
    await TestBed.configureTestingModule({
      declarations: [
        CamfilProductItemComponent,
        MockComponent(CamfilLoadingComponent),
        MockComponent(CamfilProductItemDetailedComponent),
        MockComponent(CamfilProductItemSimpleComponent),
      ],
      providers: [
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: AppFacade, useFactory: () => instance(appFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilProductItemComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.productSku = 'sku';
    component.hideAttributeName = true;

    when(accountFacade.userPermissions$).thenReturn(of([]));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('with variation product', () => {
    beforeEach(() => {
      const variation = {
        sku: 'sku',
        type: 'VariationProduct',
        variations: () => [
          {
            sku: 'skuV2',
            variableVariationAttributes: [{ variationAttributeId: 'HDD', value: '256' }],
          },
        ],
      } as VariationProductView;
      when(shoppingFacade.product$(anything(), anything())).thenReturn(of(variation));
    });

    it('should trigger add product to cart with right sku', () => {
      expect(() => fixture.detectChanges()).not.toThrow();

      component.addToBasket(3);

      verify(shoppingFacade.addProductToBasket(anything(), anything())).once();
      expect(capture(shoppingFacade.addProductToBasket).last()).toMatchInlineSnapshot(`
        Array [
          "sku",
          3,
        ]
      `);
    });

    describe('when changing variation', () => {
      it('should trigger product sku change when sku is changing', () => {
        expect(() => fixture.detectChanges()).not.toThrow();

        const emitter = spy(component.productSkuChange);

        component.replaceVariation({ selection: { HDD: '256' } });

        verify(emitter.emit(anything())).once();
        const [sku] = capture(emitter.emit).last();
        expect(sku).toMatchInlineSnapshot(`"skuV2"`);
      });

      it('should trigger add product to cart with right sku', () => {
        expect(() => fixture.detectChanges()).not.toThrow();

        component.replaceVariation({ selection: { HDD: '256' } });
        component.addToBasket(4);

        verify(shoppingFacade.addProductToBasket(anything(), anything())).once();
        expect(capture(shoppingFacade.addProductToBasket).last()).toMatchInlineSnapshot(`
          Array [
            "skuV2",
            4,
          ]
        `);
      });
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { CamfilDimensionPipe } from 'ish-core/pipes/camfil-dimension.pipe';
import { CamfilPriceSummaryPipe } from 'ish-core/pipes/camfil-price-summary.pipe';
import { CamfilProductAttributeValPipe } from 'ish-core/pipes/camfil-product-attribute-val';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { ProductRoutePipe } from 'ish-core/routing/product/product-route.pipe';
import { CamfilProductAddToBasketComponent } from 'ish-shared/components/product/camfil-product-add-to-basket/camfil-product-add-to-basket.component';
import { CamfilProductAttributeComponent } from 'ish-shared/components/product/camfil-product-attribute/camfil-product-attribute.component';
import { CamfilProductIdComponent } from 'ish-shared/components/product/camfil-product-id/camfil-product-id.component';
import { CamfilProductImageComponent } from 'ish-shared/components/product/camfil-product-image/camfil-product-image.component';
import { CamfilProductInventoryComponent } from 'ish-shared/components/product/camfil-product-inventory/camfil-product-inventory.component';
import { CamfilProductPriceComponent } from 'ish-shared/components/product/camfil-product-price/camfil-product-price.component';
import { CamfilProductQuantityComponent } from 'ish-shared/components/product/camfil-product-quantity/camfil-product-quantity.component';
import { CamfilProductTitleComponent } from 'ish-shared/components/product/camfil-product-title/camfil-product-title.component';
import { ProductBundleDisplayComponent } from 'ish-shared/components/product/product-bundle-display/product-bundle-display.component';
import { ProductVariationDisplayComponent } from 'ish-shared/components/product/product-variation-display/product-variation-display.component';
import { CheckboxComponent } from 'ish-shared/forms/components/checkbox/checkbox.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';

import { CamCardsFacade } from '../../../facades/cam-cards.facade';
import { AddProductToCamCardModalComponent } from '../../../shared/add-product-to-cam-card-modal/add-product-to-cam-card-modal.component';
import { CamCardDeliveryIntervalComponent } from '../../../shared/cam-card-delivery-interval/cam-card-delivery-interval.component';
import { CamCardLastDeliveryDateComponent } from '../../../shared/cam-card-last-delivery-date/cam-card-last-delivery-date.component';
import { CamCardProductCommentComponent } from '../../../shared/cam-card-product-comment/cam-card-product-comment.component';

import { AccountCamCardDetailLineItemComponent } from './account-cam-card-detail-line-item.component';

describe('Account Cam Card Detail Line Item Component', () => {
  let component: AccountCamCardDetailLineItemComponent;
  let fixture: ComponentFixture<AccountCamCardDetailLineItemComponent>;
  let element: HTMLElement;
  let appFacadeMock: AppFacade;
  let camCardsFacadeMock: CamCardsFacade;

  beforeEach(async () => {
    appFacadeMock = mock(AppFacade);
    camCardsFacadeMock = mock(CamCardsFacade);

    await TestBed.configureTestingModule({
      declarations: [
        AccountCamCardDetailLineItemComponent,
        MockComponent(AddProductToCamCardModalComponent),
        MockComponent(CamCardDeliveryIntervalComponent),
        MockComponent(CamCardLastDeliveryDateComponent),
        MockComponent(CamCardProductCommentComponent),
        MockComponent(CamfilProductAddToBasketComponent),
        MockComponent(CamfilProductAttributeComponent),
        MockComponent(CamfilProductIdComponent),
        MockComponent(CamfilProductImageComponent),
        MockComponent(CamfilProductInventoryComponent),
        MockComponent(CamfilProductPriceComponent),
        MockComponent(CamfilProductQuantityComponent),
        MockComponent(CamfilProductTitleComponent),
        MockComponent(CheckboxComponent),
        MockComponent(FaIconComponent),
        MockComponent(InputComponent),
        MockComponent(ProductBundleDisplayComponent),
        MockComponent(ProductVariationDisplayComponent),
        MockPipe(CamfilDimensionPipe),
        MockPipe(CamfilPriceSummaryPipe),
        MockPipe(CamfilProductAttributeValPipe),
        MockPipe(DatePipe),
        MockPipe(PricePipe),
        MockPipe(ProductRoutePipe),
      ],
      imports: [ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: CamCardsFacade, useFactory: () => instance(mock(CamCardsFacade)) },
        { provide: ShoppingFacade, useFactory: () => instance(mock(ShoppingFacade)) },
        { provide: AppFacade, useFactory: () => instance(appFacadeMock) },
        { provide: CamCardsFacade, useFactory: () => instance(camCardsFacadeMock) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountCamCardDetailLineItemComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(appFacadeMock.getChannel$).thenReturn(of('channel'));
    when(camCardsFacadeMock.customers$).thenReturn(of([]));

    component.camCardItemData = {
      id: '1234',
      product: {
        sku: 'abcd',
      },
      creationDate: 123124124,
      quantity: 1,
    };
    component.selectItemForm = new FormGroup({
      sku: new FormControl('abcd'),
      productCheckbox: new FormControl(true),
    });
    const selectedItemsFormGroup: FormGroup[] = [];
    selectedItemsFormGroup.push(component.selectItemForm);
    component.selectedItemsForm = new FormArray(selectedItemsFormGroup);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

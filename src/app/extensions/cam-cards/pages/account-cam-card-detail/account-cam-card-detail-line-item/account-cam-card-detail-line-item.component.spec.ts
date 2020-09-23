import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { ProductRoutePipe } from 'ish-core/routing/product/product-route.pipe';
import { CamfilProductAddToBasketComponent } from 'ish-shared/components/product/camfil-product-add-to-basket/camfil-product-add-to-basket.component';
import { CamfilProductIdComponent } from 'ish-shared/components/product/camfil-product-id/camfil-product-id.component';
import { CamfilProductInventoryComponent } from 'ish-shared/components/product/camfil-product-inventory/camfil-product-inventory.component';
import { CamfilProductPriceComponent } from 'ish-shared/components/product/camfil-product-price/camfil-product-price.component';
import { CamfilProductQuantityComponent } from 'ish-shared/components/product/camfil-product-quantity/camfil-product-quantity.component';
import { ProductBundleDisplayComponent } from 'ish-shared/components/product/product-bundle-display/product-bundle-display.component';
import { ProductVariationDisplayComponent } from 'ish-shared/components/product/product-variation-display/product-variation-display.component';
import { CheckboxComponent } from 'ish-shared/forms/components/checkbox/checkbox.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';
import { CamfilProductImageComponent } from 'ish-shell/header/camfil-product-image/camfil-product-image.component';

import { CamCardsFacade } from '../../../facades/cam-cards.facade';
import { SelectCamCardModalComponent } from '../../../shared/select-cam-card-modal/select-cam-card-modal.component';

import { AccountCamCardDetailLineItemComponent } from './account-cam-card-detail-line-item.component';

describe('Account Cam Card Detail Line Item Component', () => {
  let component: AccountCamCardDetailLineItemComponent;
  let fixture: ComponentFixture<AccountCamCardDetailLineItemComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccountCamCardDetailLineItemComponent,
        MockComponent(CamfilProductAddToBasketComponent),
        MockComponent(CamfilProductIdComponent),
        MockComponent(CamfilProductImageComponent),
        MockComponent(CamfilProductInventoryComponent),
        MockComponent(CamfilProductPriceComponent),
        MockComponent(CamfilProductQuantityComponent),
        MockComponent(CheckboxComponent),
        MockComponent(FaIconComponent),
        MockComponent(InputComponent),
        MockComponent(ProductBundleDisplayComponent),
        MockComponent(ProductVariationDisplayComponent),
        MockComponent(SelectCamCardModalComponent),
        MockPipe(DatePipe),
        MockPipe(ProductRoutePipe),
      ],
      imports: [ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: CamCardsFacade, useFactory: () => instance(mock(CamCardsFacade)) },
        { provide: ShoppingFacade, useFactory: () => instance(mock(ShoppingFacade)) },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountCamCardDetailLineItemComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.camCardItemData = {
      id: '1234',
      sku: 'abdc',
      creationDate: 123124124,
      desiredQuantity: { value: 1 },
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

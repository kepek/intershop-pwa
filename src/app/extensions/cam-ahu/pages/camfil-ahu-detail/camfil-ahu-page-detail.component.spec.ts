import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { CamfilProductAttributesComponent } from 'ish-shared/components/product/camfil-product-attributes/camfil-product-attributes.component';
import { CamfilProductGuidesComponent } from 'ish-shared/components/product/camfil-product-guides/camfil-product-guides.component';
import { CamfilProductImageComponent } from 'ish-shared/components/product/camfil-product-image/camfil-product-image.component';
import { CamfilProductInventoryComponent } from 'ish-shared/components/product/camfil-product-inventory/camfil-product-inventory.component';
import { CamfilProductQuantityComponent } from 'ish-shared/components/product/camfil-product-quantity/camfil-product-quantity.component';
import { CamfilProductShipmentComponent } from 'ish-shared/components/product/camfil-product-shipment/camfil-product-shipment.component';

import { CamAhuFacade } from '../../facades/cam-ahu.facade';

import { CamfilAhuCartComponent } from './camfil-ahu-cart/camfil-ahu-cart.component';
import { CamfilAHUPageDetailComponent } from './camfil-ahu-page-detail.component';
import { CamfilAhuSlotTypeComponent } from './camfil-ahu-slot-type/camfil-ahu-slot-type.component';
import { CamfilAhuSlotsComponent } from './camfil-ahu-slots/camfil-ahu-slots.component';

describe('Camfil Ahu Page Detail Component', () => {
  let component: CamfilAHUPageDetailComponent;
  let fixture: ComponentFixture<CamfilAHUPageDetailComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        CamfilAHUPageDetailComponent,
        MockComponent(CamfilAhuCartComponent),
        MockComponent(CamfilAhuSlotTypeComponent),
        MockComponent(CamfilAhuSlotsComponent),
        MockComponent(CamfilProductAttributesComponent),
        MockComponent(CamfilProductGuidesComponent),
        MockComponent(CamfilProductImageComponent),
        MockComponent(CamfilProductInventoryComponent),
        MockComponent(CamfilProductQuantityComponent),
        MockComponent(CamfilProductShipmentComponent),
        MockComponent(ContentIncludeComponent),
        MockComponent(LoadingComponent),
      ],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) },
        { provide: CamAhuFacade, useFactory: () => instance(mock(CamAhuFacade)) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilAHUPageDetailComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

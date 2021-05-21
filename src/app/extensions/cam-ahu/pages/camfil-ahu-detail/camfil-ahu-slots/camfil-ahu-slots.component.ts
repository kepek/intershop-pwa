import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.helper';
import {
  DEFAULT_CONFIGURATION,
  ProductItemContainerConfiguration,
} from 'ish-shared/components/product/camfil-product-item/camfil-product-item.component';

import { CamAhuFacade } from '../../../facades/cam-ahu.facade';
import { Unit, UnitAHUAirSlot, UnitAHUAirSlotItem } from '../../../models/unit/unit.model';
import { CamAhuAbstractComponent } from '../../camfil-ahu-abstract/camfil-ahu-abstract-page.component';

@Component({
  selector: 'camfil-ahu-slots',
  templateUrl: './camfil-ahu-slots.component.html',
  styleUrls: ['./camfil-ahu-slots.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class CamfilAhuSlotsComponent extends CamAhuAbstractComponent implements OnInit {
  constructor(
    protected router: Router,
    protected ahuFacade: CamAhuFacade,
    protected fb: FormBuilder,
    private shoppingFacade: ShoppingFacade
  ) {
    super(router, fb, ahuFacade);
  }

  @Input() ahuUnit: Unit;

  productConfiguration: ProductItemContainerConfiguration = {
    ...DEFAULT_CONFIGURATION,
    displayType: 'simple',
    displayAddToCamCard: false,
    displayAddToBasket: false,
  };

  getAhuUnitSlotItemProduct$(ahuAirSlot: UnitAHUAirSlot, sku: string) {
    return this.shoppingFacade.product$(sku, ProductCompletenessLevel.Detail).pipe(
      take(1),
      map(product => {
        const maxOrderQuantity = Number(ahuAirSlot.ahuSlotAmount);

        if (maxOrderQuantity) {
          product.maxOrderQuantity = maxOrderQuantity;
        }

        return product;
      })
    );
  }

  toggleAhuSlotItem(ahuAirSlot: UnitAHUAirSlot, item: UnitAHUAirSlotItem, quantity: number = 1) {
    this.isAhuUnitSlotItemAdded$(this.ahuUnit, ahuAirSlot.ahuSlotId, item.sku)
      .pipe(take(1))
      .subscribe(added => {
        if (added) {
          this.removeAhuSlotItemFromList(this.ahuUnit, ahuAirSlot.ahuSlotId, item.sku);
        } else {
          this.addAhuSlotItemToList(this.ahuUnit, ahuAirSlot.ahuSlotId, item.sku, quantity);
        }
      });
  }
}

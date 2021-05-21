import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { take } from 'rxjs/operators';

import {
  DEFAULT_CONFIGURATION,
  ProductItemContainerConfiguration,
} from 'ish-shared/components/product/camfil-product-item/camfil-product-item.component';

import { Unit, UnitAHUAirSlot, UnitAHUAirSlotItem } from '../../../models/unit/unit.model';
import { CamAhuAbstractComponent } from '../../camfil-ahu-abstract/camfil-ahu-abstract-page.component';

@Component({
  selector: 'camfil-ahu-slots',
  templateUrl: './camfil-ahu-slots.component.html',
  styleUrls: ['./camfil-ahu-slots.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class CamfilAhuSlotsComponent extends CamAhuAbstractComponent {
  @Input() ahuUnit: Unit;

  productConfiguration: ProductItemContainerConfiguration = {
    ...DEFAULT_CONFIGURATION,
    displayType: 'simple',
    displayAddToCamCard: false,
    displayAddToBasket: false,
  };

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

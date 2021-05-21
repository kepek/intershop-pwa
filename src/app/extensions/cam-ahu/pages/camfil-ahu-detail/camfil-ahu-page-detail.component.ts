import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { ProductView } from 'ish-core/models/product-view/product-view.model';

import { whenTruthy } from 'ish-core/utils/operators';
import { UnitAHUAirSlotItemParams } from '../../models/unit/unit.model';
import { CamAhuAbstractComponent } from '../camfil-ahu-abstract/camfil-ahu-abstract-page.component';

@Component({
  selector: 'camfil-ahu-page-detail',
  styleUrls: ['./camfil-ahu-page-detail.component.scss'],
  templateUrl: './camfil-ahu-page-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class CamfilAHUPageDetailComponent extends CamAhuAbstractComponent implements OnInit {
  product$: Observable<ProductView>;

  isMoreDetailsOpen = false;

  ngOnInit() {
    super.init();

    // TODO (extMlk): We do NOT know what's the selected AHU Unit Product is... Need to be clarified;

    this.product$ = this.ahuFacade.selectedAhuUnit$.pipe(
      whenTruthy(),
      switchMap(ahuUnit => {
        const ahuSlotItemParams: UnitAHUAirSlotItemParams = {
          manufacturerId: ahuUnit.ahu.ahuManufacturerId,
          unitId: ahuUnit.id,
          slotId: '1',
          sku: '610959',
        };

        return this.ahuFacade.getAhuUnitSlotItemProduct$(ahuSlotItemParams);
      })
    );
  }

  toggleDetails() {
    this.isMoreDetailsOpen = !this.isMoreDetailsOpen;
  }
}

import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Basket } from 'ish-core/models/basket/basket.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { CamRequisitionManagementFacade } from '../../facades/cam-requisition-management.facade';
import { Requisition } from '../../models/requisition/requisition.model';

@GenerateLazyComponent()
@Component({
  selector: 'camfil-checkout-receipt-requisition',
  templateUrl: './camfil-checkout-receipt-requisition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCheckoutReceiptRequisitionComponent implements OnInit {
  @Input() basket: Basket;

  requisition$: Observable<Requisition>;

  constructor(private camRequisitionManagementFacade: CamRequisitionManagementFacade) {}

  ngOnInit() {
    if (this.basket) {
      this.requisition$ = this.camRequisitionManagementFacade.requisition$(this.basket.id);
    }
  }
}

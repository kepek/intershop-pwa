import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';

@Component({
  selector: 'camfil-product-compare-status',
  templateUrl: './camfil-product-compare-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./camfil-product-compare-status.scss'],
})
export class CamfilProductCompareStatusComponent implements OnInit {
  productCompareCount$: Observable<number>;

  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.productCompareCount$ = this.shoppingFacade.compareProductsCount$;
  }
}

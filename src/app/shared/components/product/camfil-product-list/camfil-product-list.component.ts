import { ChangeDetectionStrategy, Component, Inject, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { PRODUCT_LISTING_ITEMS_PER_PAGE } from 'ish-core/configurations/injection-keys';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Category } from 'ish-core/models/category/category.model';
import { DeviceType, ViewType } from 'ish-core/models/viewtype/viewtype.types';
import { whenTruthy } from 'ish-core/utils/operators';

/**
 * The Product List Component displays a list of products.
 *
 * @example
 * <camfil-product-list
 *               [products]="products$ | async"
 *               [category]="category$ | async"
 *               [viewType]="viewType$ | async"
 * ></camfil-product-list>
 */
@Component({
  selector: 'camfil-product-list',
  templateUrl: './camfil-product-list.component.html',
  styleUrls: ['./camfil-product-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductListComponent implements OnInit {
  @Input() products: string[];
  @Input() category?: Category;
  @Input() viewType?: ViewType = 'simple';
  @Input() limit?: number;

  listingLoading$: Observable<boolean>;
  minForBottomLoading: number;
  isLoggedIn$: Observable<boolean>;

  constructor(
    private accountFacade: AccountFacade,
    private shoppingFacade: ShoppingFacade,
    private appFacade: AppFacade,
    private checkoutFacade: CheckoutFacade,
    @Inject(PRODUCT_LISTING_ITEMS_PER_PAGE) private itemsPerPage: number
  ) {}
  deviceType$: Observable<DeviceType>;
  ngOnInit(): void {
    this.isLoggedIn$ = this.accountFacade.isLoggedIn$;

    this.isLoggedIn$.pipe(take(1), whenTruthy()).subscribe(() => {
      this.shoppingFacade.loadBasketAddresses();
      this.checkoutFacade.loadBuckets();
    });

    this.listingLoading$ = this.shoppingFacade.productListingLoading$;
    this.deviceType$ = this.appFacade.deviceType$;

    this.minForBottomLoading = this.itemsPerPage - 2;
  }

  get isSimpleView() {
    return this.viewType === 'simple';
  }

  get isDetailedView() {
    return this.viewType === 'detailed';
  }

  ifLimit(idx: number) {
    return this.limit && idx + 1 > this.limit;
  }
}

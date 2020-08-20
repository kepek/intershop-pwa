import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Category } from 'ish-core/models/category/category.model';
import { ViewType } from 'ish-core/models/viewtype/viewtype.types';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductListComponent implements OnInit {
  @Input() products: string[];
  @Input() category?: Category;
  @Input() viewType?: ViewType = 'simple';

  listingLoading$: Observable<boolean>;

  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnInit(): void {
    this.listingLoading$ = this.shoppingFacade.productListingLoading$;
  }

  get isSimpleView() {
    return this.viewType === 'simple';
  }

  get isDetailedView() {
    return this.viewType === 'detailed';
  }
}

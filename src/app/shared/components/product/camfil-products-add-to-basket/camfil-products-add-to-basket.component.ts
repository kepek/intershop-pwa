import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ProductItem } from 'ish-core/models/product/product-item';
import { CamfilProductAddToBasketComponent } from 'ish-shared/components/product/camfil-product-add-to-basket/camfil-product-add-to-basket.component';

/**
 * Displays an add to cart button with an icon or a text label. After clicking the button a loading animation is displayed
 *
 * @example
 * <camfil-products-add-to-basket
    [product]="product"
    [class]="'btn-lg btn-block'"
    [disabled]="productDetailForm.invalid"
    [translationKey]="isRetailSet(product) ? 'product.add_to_cart.retail_set.link' : 'product.add_to_cart.link'"
    (productToBasket)="addToBasket()"
   >/camfil-product-add-to-basket>
 */
@Component({
  selector: 'camfil-products-add-to-basket',
  templateUrl: './camfil-products-add-to-basket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class CamfilProductsAddToBasketComponent extends CamfilProductAddToBasketComponent {
  @Input() products: ProductItem[];
}

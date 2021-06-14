import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ProductItem } from 'ish-core/models/product/product-item';

import { CreateOrderProductSuccessComponent } from '../../add-product-to-cart-modal/create-order-product-success/create-order-product-success.component';

@Component({
  selector: 'camfil-create-order-products-success',
  templateUrl: './create-order-products-success.component.html',
  styleUrls: ['./create-order-products-success.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class CreateOrderProductsSuccessComponent extends CreateOrderProductSuccessComponent {
  @Input() products: ProductItem[];
}

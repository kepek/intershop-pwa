import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ProductItem } from 'ish-core/models/product/product-item';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { AddProductsToCamCardModalComponent } from '../add-products-to-cam-card-modal/add-products-to-cam-card-modal.component';
import { ProductAddToCamCardComponent } from '../product-add-to-cam-card/product-add-to-cam-card.component';

@Component({
  selector: 'camfil-products-add-to-cam-card',
  templateUrl: './products-add-to-cam-card.component.html',
  styleUrls: ['./products-add-to-cam-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * The Product Add To Cam Card Component adds a product to a cam_cards.
 *
 * @example
 * <camfil-products-add-to-cam-card [products]="products" displayType="icon"></camfil-product-add-to-cam-card>
 */
@GenerateLazyComponent()
// tslint:disable-next-line:component-creation-test
export class ProductsAddToCamCardComponent extends ProductAddToCamCardComponent {
  @Input() products: ProductItem[];

  openModal(modal: AddProductsToCamCardModalComponent) {
    this.dialog.open(modal.show());
    modal.hide = () => this.dialog.closeAll();
  }

  openAddModal(modal: AddProductsToCamCardModalComponent) {
    this.dialog.open(modal.show());
    modal.hide = () => this.dialog.closeAll();
  }
}

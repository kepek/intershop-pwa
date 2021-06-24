import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

import { Product } from 'ish-core/models/product/product.model';

@Component({
  selector: 'camfil-create-order-product-success',
  templateUrl: './create-order-product-success.component.html',
  styleUrls: ['./create-order-product-success.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrderProductSuccessComponent {
  @Input() product: Product;
  @Output() hideEmitter = new EventEmitter<void>();
  @Output() hideSearchBox = new EventEmitter<void>();

  constructor(private router: Router) {}

  hide() {
    this.hideEmitter.emit();
  }

  hideSearchDialog() {
    this.hideSearchBox.emit();
  }

  goToCart() {
    this.router.navigate(['/checkout']);
    this.hide();
    this.hideSearchDialog();
  }
}

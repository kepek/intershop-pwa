import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

import { Product } from 'ish-core/models/product/product.model';

@Component({
  selector: 'camfil-create-order-success',
  templateUrl: './create-order-success.component.html',
  styleUrls: ['./create-order-success.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrderSuccessComponent {
  @Input() product: Product;
  @Output() hideEmitter = new EventEmitter<void>();

  constructor(private router: Router) {}

  hide() {
    this.hideEmitter.emit();
  }

  goToCart() {
    this.router.navigate(['/checkout']);
    this.hide();
  }
}

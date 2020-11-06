import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Product } from 'ish-core/models/product/product.model';

@Component({
  selector: 'camfil-ahu-slots',
  templateUrl: './camfil-ahu-slots.component.html',
  styleUrls: ['./camfil-ahu-slots.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilAhuSlotsComponent {
  /**
   * The product with the image information.
   */
  @Input() product: Product;
  slots = new Array(4);
  items = new Array(5);
}

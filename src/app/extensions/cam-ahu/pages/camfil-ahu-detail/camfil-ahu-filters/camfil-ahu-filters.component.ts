import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Product } from 'ish-core/models/product/product.model';

@Component({
  selector: 'camfil-ahu-filters',
  templateUrl: './camfil-ahu-filters.component.html',
  styleUrls: ['./camfil-ahu-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilAhuFiltersComponent {
  /**
   * The product with the image information.
   */
  @Input() product: Product;
}

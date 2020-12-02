import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Product } from 'ish-core/models/product/product.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

@Component({
  selector: 'camfil-quick-view-modal',
  templateUrl: './camfil-quick-view-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * The Product Add To Cam Card Component adds a product to a cam_cards.
 *
 * @example
 * <camfil-quick-view-modal
 *               [product]=product
 *               class="my-class"
 * ></camfil-quick-view-modal>
 */
@GenerateLazyComponent()
export class CamfilQuickViewModalComponent {
  @Input() product: Product;
  @Input() class?: string;

  constructor(public dialog: MatDialog) {}
}

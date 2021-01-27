import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Product } from 'ish-core/models/product/product.model';
import { CamfilQuickViewModalComponent } from 'ish-shared/components/common/camfil-quick-view-modal/camfil-quick-view-modal.component';

@Component({
  selector: 'camfil-product-quickview',
  templateUrl: './camfil-product-quickview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductQuickviewComponent {
  @Input() product: Product;
  @Input() hideText = false;
  constructor(public dialog: MatDialog) {}
  /** Determine the heading of the delete modal and opens the modal. */
  openQuickViewDialog() {
    this.dialog.open(CamfilQuickViewModalComponent, {
      width: '768px',
      autoFocus: false,
      maxHeight: '80vh',
      data: { sku: this.product.sku },
    });
  }
}

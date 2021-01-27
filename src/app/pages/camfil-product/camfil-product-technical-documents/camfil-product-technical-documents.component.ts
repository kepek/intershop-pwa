import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Product } from 'ish-core/models/product/product.model';

@Component({
  selector: 'camfil-product-technical-documents',
  templateUrl: './camfil-product-technical-documents.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductTechnicalDocumentsComponent {
  @Input() product: Product;
  @Input() getImageViewIDs: (product: Product, imageType: string) => string[];
}

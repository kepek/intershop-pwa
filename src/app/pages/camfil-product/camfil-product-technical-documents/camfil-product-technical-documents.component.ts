import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ProductTechnicalDocument } from 'ish-core/models/product-technical-document/product-technical-document.model';
import { Product } from 'ish-core/models/product/product.model';

@Component({
  selector: 'camfil-product-technical-documents',
  templateUrl: './camfil-product-technical-documents.component.html',
  styleUrls: ['./camfil-product-technical-documents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductTechnicalDocumentsComponent implements OnInit {
  @Input() product: Product;
  @Input() getImageCdnUrl: (product: Product, imageType: string, imageView: string) => string;
  productDocuments: ProductTechnicalDocument[];

  ngOnInit(): void {
    this.getTechnicalDocuments();
  }

  getTechnicalDocuments() {
    const imageTypes = ['RTYP2', 'RTYP12', 'RTYP15'];
    const productDocumentTypes = [
      {
        name: 'Brochures',
        type: 'RTYP2',
      },
      {
        name: 'Product PDF, Web',
        type: 'RTYP12',
      },
      {
        name: 'Handling & Maintenance',
        type: 'RTYP15',
      },
    ];

    this.productDocuments = this.product?.images
      ?.filter(image => imageTypes.includes(image.typeID) && image.viewID === 'default')
      .map(document => ({
        name: productDocumentTypes.find(prodDoc => prodDoc.type === document.typeID)?.name,
        effectiveUrl: this.getImageCdnUrl(this.product, document.typeID, document.viewID),
      }));
  }
}

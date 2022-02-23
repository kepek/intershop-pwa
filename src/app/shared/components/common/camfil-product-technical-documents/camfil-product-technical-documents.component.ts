import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { CamfilConfigurationFacade } from 'camfil-pwa/facades/camfil-configuration.facade';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ProductTechnicalDocument } from 'ish-core/models/product-technical-document/product-technical-document.model';
import { Product, ProductHelper } from 'ish-core/models/product/product.model';

@Component({
  selector: 'camfil-product-technical-documents',
  templateUrl: './camfil-product-technical-documents.component.html',
  styleUrls: ['./camfil-product-technical-documents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductTechnicalDocumentsComponent implements OnChanges, OnDestroy {
  @Input() product: Product;
  @Input() getImageCdnUrl: (product: Product, imageType: string, imageView: string) => string;
  productDocuments: ProductTechnicalDocument[];
  private destroy$ = new Subject();

  constructor(private camfilConfigurationFacade: CamfilConfigurationFacade) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.product) {
      this.camfilConfigurationFacade
        .isEnabled$('showAllDocsType')
        .pipe(takeUntil(this.destroy$))
        .subscribe(showAllDocsType => {
          this.productDocuments = ProductHelper.getTechnicalDocuments(this.product, showAllDocsType);
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

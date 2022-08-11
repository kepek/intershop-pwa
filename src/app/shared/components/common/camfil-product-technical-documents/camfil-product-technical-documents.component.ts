import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { CamfilConfigurationFacade } from 'camfil-pwa/facades/camfil-configuration.facade';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
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

  constructor(private camfilConfigurationFacade: CamfilConfigurationFacade, private appFacade: AppFacade) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.product) {
      combineLatest([
        this.camfilConfigurationFacade.isEnabled$('showAllDocsType'),
        this.camfilConfigurationFacade.isEnabled$('filterDocsByLanguage'),
        this.appFacade.currentLocale$,
      ])
        .pipe(takeUntil(this.destroy$))
        ?.subscribe(([showAllDocsType, filterDocsByLanguage, locale]) => {
          this.productDocuments = ProductHelper.getTechnicalDocuments(
            this.product,
            showAllDocsType,
            filterDocsByLanguage,
            locale.lang
          );
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

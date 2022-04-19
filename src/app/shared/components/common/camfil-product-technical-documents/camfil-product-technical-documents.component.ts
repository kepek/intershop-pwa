import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { CamfilConfigurationFacade } from 'camfil-pwa/facades/camfil-configuration.facade';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ProductTechnicalDocument } from 'ish-core/models/product-technical-document/product-technical-document.model';
import { Product, ProductHelper } from 'ish-core/models/product/product.model';
import { AppFacade } from 'ish-core/facades/app.facade';

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
        this.camfilConfigurationFacade.isEnabled$('showAllDocsType').pipe(takeUntil(this.destroy$)),
        this.appFacade.currentLocale$,
      ])?.subscribe(([showAllDocsType, locale]) => {
        this.productDocuments = ProductHelper.getTechnicalDocuments(this.product, showAllDocsType, locale.lang);
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

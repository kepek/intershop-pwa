import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';

/**
 * The Product Image Component renders the product image
 * for the given imageType and imageView or the according defaults.
 *
 * @example
 * <camfil-product-image [product]="product" imageType="M"></camfil-product-image>
 */
@Component({
  selector: 'camfil-product-image',
  templateUrl: './camfil-product-image.component.html',
  styleUrls: ['./camfil-product-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductImageComponent extends ProductImageComponent implements OnChanges {
  constructor(translateService: TranslateService) {
    super(translateService);
  }

  @Input() width: number;
  @Input() height: number;

  imageSourceUrl(): string {
    const url = super.imageSourceUrl();

    if (url.match('^(https?|file):') || !url.startsWith('/')) {
      const urlObject = new URL(url);
      const height = this.height?.toString() || 'auto';
      const width = this.width?.toString() || '250';
      const bgColor = 'transparent';

      urlObject?.searchParams?.set('height', height);
      urlObject?.searchParams?.set('width', width);
      urlObject?.searchParams?.set('bgcolor', bgColor);

      return urlObject?.toString() || url;
    }

    return url;
  }
}

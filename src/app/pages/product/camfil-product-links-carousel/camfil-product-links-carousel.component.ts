import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

import { ProductLinkView } from 'ish-core/models/product-links/product-links.model';
import { ProductItemContainerConfiguration } from 'ish-shared/components/product/camfil-product-item/camfil-product-item.component';

/**
 * The Product Link Carousel Component
 *
 * Displays the products which are assigned to a specific product link type as an carousel.
 * It uses the {@link ProductItemContainerComponent} for the rendering of products.
 *
 * @example
 * <camfil-product-links-carousel [links]="links.crossselling" [productLinkTitle]="'product.product_links.crossselling.title' | translate"></camfil-product-links-carousel>
 */
@Component({
  selector: 'camfil-product-links-carousel',
  templateUrl: './camfil-product-links-carousel.component.html',
  styleUrls: ['./camfil-product-links-carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductLinksCarouselComponent {
  /**
   * list of products which are assigned to the specific product link type
   */
  @Input() links: ProductLinkView;
  /**
   * title that should displayed for the specific product link type
   */
  @Input() productLinkTitle: string;
  /**
   * configuration for swiper carousel
   */
  @Input() swiperConfig: SwiperConfigInterface;
  /**
   * configuration for product tiles
   */
  @Input() tileConfiguration?: ProductItemContainerConfiguration;
}

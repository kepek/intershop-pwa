import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { Product } from 'ish-core/models/product/product.model';

@Component({
  selector: 'camfil-product-badges',
  templateUrl: './camfil-product-badges.component.html',
  styleUrls: ['./camfil-product-badges.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductBadgesComponent implements OnInit {
  @Input() product: Product;
  @Input() getImageCdnUrl: (product: Product, imageType: string, imageView: string) => string;
  productBadgesUrls: string[];
  ngOnInit(): void {
    this.getProductBadges();
  }

  getProductBadges() {
    this.productBadgesUrls = this.product?.images
      ?.filter(image => image.typeID === 'badges')
      .map(badge => this.getImageCdnUrl(this.product, badge.typeID, badge.viewID));
  }
}

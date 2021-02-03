import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

import { Product, ProductHelper } from 'ish-core/models/product/product.model';

/**
 * The Product Images Component
 *
 * Displays carousel slides for all images of the product and a thumbnails list as carousel indicator.
 * It uses the {@link ProductImageComponent} for the rendering of product images.
 *
 * @example
 * <ish-product-images [product]="product"></ish-product-images>
 */
@Component({
  selector: 'camfil-product-images',
  templateUrl: './camfil-product-images.component.html',
  styleUrls: ['./camfil-product-images.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductImagesComponent implements OnInit {
  constructor(private sanitizer: DomSanitizer) {}
  /**
   * The product for which the images should be displayed
   */
  @Input() product: Product;
  @ViewChild('ngcarousel', { static: true }) ngCarousel: NgbCarousel;
  @ViewChild('videoFrame') videoFrame: ElementRef;
  activeSlide = '0';
  videoUrl: string;
  secureVideoUrl: SafeResourceUrl;
  secureVideoThumbnailUrl: SafeResourceUrl;

  getImageCdnUrl = ProductHelper.getImageCdnUrl;
  getImageViewIDsExcludePrimary = ProductHelper.getImageViewIDsExcludePrimary;

  ngOnInit(): void {
    this.videoUrl = this.getImageCdnUrl(this.product, 'youTubeVideos', 'view1');
    if (this.videoUrl) {
      this.secureVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.videoUrl + '?enablejsapi=1&version=3&playerapiid=ytplayer'
      );
      this.secureVideoThumbnailUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.getVideoThumbnailUrl());
    }
  }

  /**
   * Set the active slide via index (used by the thumbnail indicator)
   * @param slideIndex The slide index number to set the active slide
   */
  setActiveSlide(slideIndex: number) {
    this.activeSlide = `${slideIndex}`;
    this.ngCarousel.select(`${slideIndex}`);

    // pause video
    if (this.videoFrame) {
      this.videoFrame.nativeElement.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    }
  }

  /**
   * Check if the given slide index equals the active slide
   * @param slideIndex The slide index number to be checked if it is the active slide
   * @returns True if the given slide index is the active slide, false otherwise
   */
  isActiveSlide(slideIndex: number): boolean {
    return this.activeSlide === `${slideIndex}`;
  }

  /**
   * Returns the index of the video thumbnail
   * @returns index
   */
  getVideoThumbnailIndex(): number {
    return this.getImageViewIDsExcludePrimary(this.product, 'images').length + 2;
  }

  /**
   * Returns the index of the video thumbnail
   * @returns index
   */
  getVideoThumbnailUrl(): string {
    const videoId = this.videoUrl.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/).pop();
    return '//img.youtube.com/vi/' + videoId + '/mqdefault.jpg';
  }
}

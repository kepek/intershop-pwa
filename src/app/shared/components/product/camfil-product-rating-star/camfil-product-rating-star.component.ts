import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * The Product Rating Star Component renders a single rating star.
 *
 * @example
 * <camfil-product-rating-star filled="full" [lastStar]="true"></camfil-product-rating-star>
 */
@Component({
  selector: 'camfil-product-rating-star',
  templateUrl: './camfil-product-rating-star.component.html',
  styleUrls: ['./camfil-product-rating-star.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductRatingStarComponent {
  /**
   * filling state of the star
   */
  @Input() filled: 'full' | 'half' | 'empty';
  /**
   * add space, when the star isn't the last one
   */
  @Input() lastStar = false;
}

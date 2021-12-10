import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * The Info Box Component renders the parent's outlet html in a box. If an edit routerLink is given a link is displayed to route to an edit page
 *
 * @example
 * <camfil-info-box heading="checkout.widget.billing-address.heading" editRouterLink="/checkout/address">
 *  <ish-address [address]="basket.invoiceToAddress"></ish-address>
 * </camfil-info-box>
 */
@Component({
  selector: 'camfil-info-box',
  templateUrl: './camfil-info-box.component.html',
  styleUrls: ['./camfil-info-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilInfoBoxComponent {
  /**
   * Translation key of the box title (or fix title text).
   */
  @Input() heading = '';

  /**
   * Translation key of the box description.
   */
  @Input() description = '';

  /**
   * Router link for Editing the displayed data. If a routerLink is given a link is displayed to route *to an edit page
   */
  @Input() editRouterLink: string;

  /**
   * Additional css classes to be passed to the infobox div
   */
  @Input() cssClass?: string;

  /**
   * Translation key of the box description.
   */
  @Input() expanded = true;
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'camfil-ahu-cart',
  templateUrl: './camfil-ahu-cart.component.html',
  styleUrls: ['./camfil-ahu-cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilAhuCartComponent {
  /**
   * The product with the image information.
   */
  @Input() unitAHUAirSlots: [];
  items = new Array(5);
}

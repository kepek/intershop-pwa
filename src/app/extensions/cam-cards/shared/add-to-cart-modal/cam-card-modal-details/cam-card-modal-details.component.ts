import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Address } from 'ish-core/models/address/address.model';

@Component({
  selector: 'camfil-cam-card-modal-details',
  templateUrl: './cam-card-modal-details.component.html',
  styleUrls: ['./cam-card-modal-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamCardModalDetailsComponent {
  @Input() label?: string;
  @Input() nextDelivery: string;
  @Input() orderMark: string;
  @Input() invoiceMark: string;
  @Input() deliveryAddress: Address;
  @Input() isClicked = false;
}

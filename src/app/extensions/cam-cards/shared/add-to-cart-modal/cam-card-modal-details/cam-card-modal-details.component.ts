import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'camfil-cam-card-modal-details',
  templateUrl: './cam-card-modal-details.component.html',
  styleUrls: ['./cam-card-modal-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamCardModalDetailsComponent {
  @Input() label: string;
  @Input() nextDelivery: string;
  @Input() orderMark: string;
  @Input() isClicked = false;
}

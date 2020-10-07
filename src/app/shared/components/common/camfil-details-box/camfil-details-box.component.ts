import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'camfil-details-box',
  templateUrl: './camfil-details-box.component.html',
  styleUrls: ['./camfil-details-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilDetailsBoxComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() icon = '';
}

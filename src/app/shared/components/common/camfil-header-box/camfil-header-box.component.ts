import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'camfil-header-box',
  templateUrl: './camfil-header-box.component.html',
  styleUrls: ['./camfil-header-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilHeaderBoxComponent {
  @Input() header: string;
  @Input() description: string;
}

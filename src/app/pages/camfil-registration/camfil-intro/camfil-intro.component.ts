import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'camfil-intro',
  templateUrl: './camfil-intro.component.html',
  styleUrls: ['./camfil-intro.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilIntroComponent {
  @Input() header: string;
  @Input() description: string;
}

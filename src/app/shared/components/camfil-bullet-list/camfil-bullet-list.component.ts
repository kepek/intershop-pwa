import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'camfil-bullet-list',
  templateUrl: './camfil-bullet-list.component.html',
  styleUrls: ['./camfil-bullet-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilBulletListComponent {
  @Input() bullets: String[];
}

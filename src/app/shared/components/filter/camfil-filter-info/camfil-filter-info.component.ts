import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'camfil-filter-info',
  templateUrl: './camfil-filter-info.component.html',
  styleUrls: ['./camfil-filter-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilFilterInfoComponent {
  @Input() title: string;
  @Input() note: string;
}

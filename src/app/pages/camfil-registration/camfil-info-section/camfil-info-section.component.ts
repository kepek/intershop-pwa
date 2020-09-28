import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'camfil-info-section',
  templateUrl: './camfil-info-section.component.html',
  styleUrls: ['./camfil-info-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilInfoSectionComponent {
  bullets: String[] = ['test0', 'test1', 'test2', 'test3'];
}

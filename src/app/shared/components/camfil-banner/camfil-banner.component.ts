import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'camfil-banner',
  templateUrl: './camfil-banner.component.html',
  styleUrls: ['./camfil-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilBannerComponent {
  @Input() title: string = '';
  @Input() iconName: string = '';
  @Input() description: string = '';
  @Input() linkTitle: string = '';
  @Input() linkUrl: string = '';
  @Input() backgroundImageUrl: string;
}

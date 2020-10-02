import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'camfil-banner',
  templateUrl: './camfil-banner.component.html',
  styleUrls: ['./camfil-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilBannerComponent {
  @Input() title = '';
  @Input() iconName = '';
  @Input() description = '';
  @Input() linkTitle = '';
  @Input() linkUrl = '';
  @Input() backgroundImageUrl: string;
}

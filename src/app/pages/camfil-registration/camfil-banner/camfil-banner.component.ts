import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'camfil-banner',
  templateUrl: './camfil-banner.component.html',
  styleUrls: ['./camfil-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilBannerComponent {}

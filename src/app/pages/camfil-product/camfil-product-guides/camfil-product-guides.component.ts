import { ChangeDetectionStrategy, Component } from '@angular/core';

import { GUIDES, PDPGuide } from './database';

@Component({
  selector: 'camfil-product-guides',
  templateUrl: './camfil-product-guides.component.html',
  styleUrls: ['./camfil-product-guides.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductGuidesComponent {
  guides: PDPGuide[] = GUIDES;
}

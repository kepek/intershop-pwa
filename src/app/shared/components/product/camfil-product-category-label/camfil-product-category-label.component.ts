import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CategoryView } from 'ish-core/models/category-view/category-view.model';

@Component({
  selector: 'camfil-product-category-label',
  templateUrl: './camfil-product-category-label.component.html',
  styleUrls: ['./camfil-product-category-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductCategoryLabelComponent {
  @Input() category?: CategoryView;
}

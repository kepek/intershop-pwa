import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { Category } from 'ish-core/models/category/category.model';
import { generateCategoryUrl } from 'ish-core/routing/category/category.route';

@Component({
  selector: 'camfil-category-box',
  templateUrl: './camfil-category-box.component.html',
  styleUrls: ['./camfil-category-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCategoryBoxComponent {
  @Input() size: 'small' | 'normal' = 'normal';
  @Input() category: CategoryView;

  getCategoryUrl(category: Category) {
    return generateCategoryUrl(category);
  }
}

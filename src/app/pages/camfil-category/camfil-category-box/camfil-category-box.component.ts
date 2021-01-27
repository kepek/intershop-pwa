import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

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
  @Output() click = new EventEmitter();

  getCategoryUrl(category: Category) {
    return generateCategoryUrl(category);
  }

  handleClick() {
    this.click.emit();
  }
}

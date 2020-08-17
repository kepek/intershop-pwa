import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';

/**
 * The Category Tile Component renders a category tile with the image of the
 * category using {@link CategoryImageComponent}.
 *
 * @example
 * <camfil-category-tile [categoryUniqueId]="category"></camfil-category-tile>
 */
@Component({
  selector: 'camfil-category-tile',
  templateUrl: './camfil-category-tile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCategoryTileComponent implements OnInit {
  /**
   * The Category to render a tile for
   */
  @Input() categoryUniqueId: string;

  category$: Observable<CategoryView>;

  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.category$ = this.shoppingFacade.category$(this.categoryUniqueId);
  }
}

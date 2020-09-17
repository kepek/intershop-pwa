import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';

@Component({
  selector: 'camfil-category-boxes',
  templateUrl: './camfil-category-boxes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCategoryBoxesComponent implements OnInit {
  // TODO: tmp data for example
  // TODO: + to impelment list for children/small boxes
  categoryLandingBoxIds = ['servers.servers-data-storage', 'Computers.1835', 'Computers.897.897_Acer', 'Computers.225'];
  categories$: Observable<CategoryView[]>;
  categoriesColumns = [];

  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.categories$ = this.shoppingFacade.categories$(this.categoryLandingBoxIds);
    this.categoriesColumns.push(this.categories$, this.categories$);
  }
}

import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { NavigationCategory } from 'ish-core/models/navigation-category/navigation-category.model';

@Component({
  selector: 'camfil-category-navigation',
  templateUrl: './camfil-category-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./camfil-category-navigation.component.scss'],
})
export class CamfilCategoryNavigationComponent implements OnInit, OnChanges {
  @Input() uniqueId: string;

  navigationCategories$: Observable<NavigationCategory[]>;
  currentCategoryId$: Observable<string>;
  trail$: Observable<string[]>;

  constructor(private shoppingFacade: ShoppingFacade, private appFacade: AppFacade) {}

  ngOnInit() {
    this.currentCategoryId$ = this.shoppingFacade.selectedCategory$.pipe(map(c => c?.uniqueId));
    this.trail$ = this.appFacade.breadcrumbCategoryNames$;
  }

  ngOnChanges() {
    this.navigationCategories$ = this.shoppingFacade.navigationCategories$(this.uniqueId);
    this.trail$ = this.appFacade.breadcrumbCategoryNames$;
  }
}

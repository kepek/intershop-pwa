import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { NavigationCategory } from 'ish-core/models/navigation-category/navigation-category.model';
import { whenTruthy } from 'ish-core/utils/operators';

@Component({
  selector: 'camfil-category-navigation',
  templateUrl: './camfil-category-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./camfil-category-navigation.component.scss'],
})
export class CamfilCategoryNavigationComponent implements OnInit, OnChanges, OnDestroy {
  private destroy$ = new Subject();
  @Input() uniqueId: string;

  navigationCategories$: Observable<NavigationCategory[]>;
  currentCategoryId$: Observable<string>;
  trail$: Observable<string[]>;
  filterParams;

  constructor(
    private shoppingFacade: ShoppingFacade,
    private appFacade: AppFacade,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    // make sure we see the latest queryParams when subscribing to the route in ngOnInit
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.currentCategoryId$ = this.shoppingFacade.selectedCategory$.pipe(map(c => c?.uniqueId));
    this.trail$ = this.appFacade.breadcrumbCategoryNames$;

    this.activatedRoute.queryParams.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(params => {
      if (params.filters) {
        this.filterParams = params.filters.split('&category')[0].split('&productFilter')[0];
      }
    });
  }

  ngOnChanges() {
    this.navigationCategories$ = this.shoppingFacade.navigationCategories$(this.uniqueId);
    this.trail$ = this.appFacade.breadcrumbCategoryNames$;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getQueryParams(uniqueId: string) {
    const category = '&category=' + uniqueId?.split('.').join('/');
    const productFilter = '&productFilter=fallback_searchquerydefinition';

    if (!category || !this.filterParams) {
      return {};
    } else {
      return { filters: this.filterParams + productFilter + category };
    }
  }
}

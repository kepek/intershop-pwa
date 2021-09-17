import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { URLFormParams, formParamsToString } from 'ish-core/utils/url-form-params';

@Component({
  selector: 'camfil-filter-navigation',
  templateUrl: './camfil-filter-navigation.component.html',
  styleUrls: ['./camfil-filter-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilFilterNavigationComponent implements OnInit, OnDestroy {
  @Input() fragmentOnRouting: string;
  @Input() orientation: 'sidebar' | 'horizontal' = 'sidebar';
  @Input() showCategoryFilter = true;

  filter$: Observable<FilterNavigation>;
  categoryParam: string;

  private destroy$ = new Subject<void>();

  constructor(private shoppingFacade: ShoppingFacade, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.filter$ = this.shoppingFacade.currentFilter$(this.showCategoryFilter);

    this.shoppingFacade.selectedCategory$?.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(value => {
      this.categoryParam = value?.uniqueId?.replace(/\./g, '/');
    });
  }

  applyFilter(event: { searchParameter: URLFormParams }) {
    let params = formParamsToString(event.searchParameter);
    params = this.categoryParam ? params + '&category=' + this.categoryParam : params;

    this.router.navigate([], {
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute,
      queryParams: { filters: params, page: 1 },
      fragment: this.fragmentOnRouting,
    });
  }

  get isSideBar() {
    return this.orientation === 'sidebar';
  }

  clearFilters() {
    this.router.navigate([], {
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute,
      queryParams: { filters: undefined, page: 1 },
      fragment: this.fragmentOnRouting,
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

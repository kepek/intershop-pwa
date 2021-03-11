import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { URLFormParams, formParamsToString } from 'ish-core/utils/url-form-params';

@Component({
  selector: 'camfil-filter-measurements',
  templateUrl: './camfil-filter-measurements.component.html',
  styleUrls: ['./camfil-filter-measurements.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilFilterMeasurementsComponent implements OnInit, OnDestroy {
  width;
  height;
  depth;
  @Input() fragmentOnRouting: string;
  currentFilters$: Observable<FilterNavigation>;
  filters: URLSearchParams;
  showCategoryFilter = false;
  private destroy$ = new Subject();

  constructor(private shoppingFacade: ShoppingFacade, private router: Router, private activatedRoute: ActivatedRoute) {
    // make sure we see the latest queryParams when subscribing to the route in ngOnInit
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(params => {
      this.filters = new URLSearchParams(decodeURIComponent(params.filters));
      this.width = this.calculateFilterValue('Width');
      this.height = this.calculateFilterValue('Height');
      this.depth = this.calculateFilterValue('Depth');
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  calculateFilterValue(name: string) {
    const lowerBound = parseInt(this.filters.get(name + '[gte]'), 10);
    const upperBound = parseInt(this.filters.get(name + '[lte]'), 10);
    if (!isNaN(lowerBound) && !isNaN(upperBound)) {
      return (lowerBound + upperBound) / 2;
    } else {
      return;
    }
  }

  change(facet, type) {
    this[type] = facet;
  }

  filter() {
    // identify current search parameters (category, previous filters) and remove width, height, depth
    let currentFilterParams = {};
    this.currentFilters$ = this.shoppingFacade.currentFilter$(this.showCategoryFilter);
    this.currentFilters$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(currentFilters => {
      currentFilterParams = this.stripMeasurementSearchParameters(
        currentFilters?.filter?.filter(filterElement => filterElement.id === 'Width')[0]?.facets[0].searchParameter
      );
    });

    const filter = [
      !!this.width && `Width%5Bgte%5D=${this.width - 10}&Width%5Blte%5D=${+this.width + 10}`,
      !!this.height && `Height%5Bgte%5D=${+this.height - 10}&Height%5Blte%5D=${+this.height + 10}`,
      !!this.depth && `Depth%5Bgte%5D=${+this.depth - 50}&Depth%5Blte%5D=${+this.depth + 50}`,
      formParamsToString(currentFilterParams),
    ].join('&');

    if (+this.width || +this.height || +this.depth) {
      this.router.navigate([], {
        queryParamsHandling: 'merge',
        relativeTo: this.activatedRoute,
        queryParams: {
          filters: filter,
        },
        fragment: this.fragmentOnRouting,
      });
    }
  }

  isDisabled() {
    return this.width || this.height || this.depth ? !1 : !0;
  }

  // Remove 'Width', 'Height', 'Depth' from search parameters
  stripMeasurementSearchParameters(params: URLFormParams) {
    const forbiddenKeys = ['Width', 'Height', 'Depth'];
    return Object.keys(params)
      .filter(key => !forbiddenKeys.includes(key))
      .reduce((obj, key) => {
        obj[key] = params[key];
        return obj;
      }, {});
  }
}

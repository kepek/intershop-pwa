import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { URLFormParams, stringToFormParams } from 'ish-core/utils/url-form-params';

@Component({
  selector: 'camfil-filter-navigation-badges',
  templateUrl: './camfil-filter-navigation-badges.component.html',
  styleUrls: ['./camfil-filter-navigation-badges.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilFilterNavigationBadgesComponent implements OnInit, OnChanges {
  @Input() filterNavigation: FilterNavigation;
  @Input() appliedFilters: string;
  @Output() applyFilter = new EventEmitter<{ searchParameter: URLFormParams }>();
  @Output() clearFilters = new EventEmitter<void>();
  selected: { searchParameter: URLFormParams; displayName: string; filterName: string; filterId: string }[];
  showCategoryFilter = false;
  width;
  height;
  depth;
  filters: URLSearchParams;
  currentFilters$: Observable<FilterNavigation>;
  private destroy$ = new Subject();

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    // make sure we see the latest queryParams when subscribing to the route in ngOnInit
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {}

  ngOnChanges() {
    this.selected = this.filterNavigation?.filter?.reduce(
      (acc, filterElement) => [
        ...acc,
        ...filterElement.facets
          .filter(facet => facet.selected)
          .map(({ searchParameter, displayName }) => ({
            filterId: filterElement.id,
            filterName: filterElement.name,
            displayName,
            searchParameter,
          })),
      ],
      []
    );

    this.activatedRoute.queryParams.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(params => {
      this.filters = new URLSearchParams(decodeURIComponent(params.filters));
      this.width = this.calculateFilterValue('Width');
      this.height = this.calculateFilterValue('Height');
      this.depth = this.calculateFilterValue('Depth');
    });
  }

  calculateFilterValue(name: string) {
    const lowerBound = parseInt(this.filters.get(name + '[gte]'), 10);
    const upperBound = parseInt(this.filters.get(name + '[lte]'), 10);
    if (!isNaN(lowerBound) && !isNaN(upperBound)) {
      return `[${lowerBound} - ${upperBound}]`;
    } else {
      return;
    }
  }

  apply(searchParameter: URLFormParams) {
    this.applyFilter.emit({ searchParameter });
  }

  clear() {
    this.clearFilters.emit();
  }

  /**
   *  Remove a filter from search parameters
   * */
  removeFilter(targetFilter: string) {
    const currentFilterParams = this.stripFilterParameter(stringToFormParams(this.filters.toString()), targetFilter);
    this.applyFilter.emit({ searchParameter: currentFilterParams });
  }

  /**
   *  Remove a specific URL parameter
   * */
  stripFilterParameter(params: URLFormParams, filter: string) {
    if (!params) {
      return;
    }

    return Object.keys(params)
      .filter(key => !key.startsWith(filter))
      .reduce((obj, key) => {
        obj[key] = params[key];
        return obj;
      }, {});
  }

  countNotNull(array) {
    let i = array.length;
    let count = 0;
    while (i--) {
      if (array[i]) {
        count++;
      }
    }
    return count;
  }
}

import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { SortableAttributesType } from 'ish-core/models/product-listing/product-listing.model';
import { ViewType } from 'ish-core/models/viewtype/viewtype.types';
import { whenTruthy } from 'ish-core/utils/operators';
import { URLFormParams, formParamsToString } from 'ish-core/utils/url-form-params';
import { SelectOption } from 'ish-shared/forms/components/select/select.component';

@Component({
  selector: 'camfil-product-list-toolbar',
  templateUrl: './camfil-product-list-toolbar.component.html',
  styleUrls: ['./camfil-product-list-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductListToolbarComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() itemCount: number;
  @Input() viewType: ViewType = 'simple';
  @Input() sortBy = 'default';
  @Input() sortableAttributes: SortableAttributesType[];
  @Input() currentPage: number;
  @Input() pageIndices: number[];
  @Input() fragmentOnRouting: string;
  @Input() isPaging = false;
  @Input() categoryName: string;
  @Input() showCategoryFilter = false;
  sortingParam: string;
  sortDropdown = new FormControl('');
  sortOptions: SelectOption[] = [];
  filter$: Observable<FilterNavigation>;

  private destroy$ = new Subject<void>();

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.filter$ = this.shoppingFacade.currentFilter$(this.showCategoryFilter);
    this.activatedRoute.queryParamMap.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(params => {
      if (params) {
        this.sortingParam = params.get('sorting');
      }
    });
  }

  ngAfterViewInit() {
    if (this.sortingParam) {
      this.sortDropdown.setValue(this.sortingParam);
    }
  }

  ngOnChanges() {
    this.sortOptions = this.mapSortableAttributesToSelectOptions(this.sortableAttributes);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeSortBy(target: EventTarget) {
    // tslint:disable-next-line: no-string-literal
    const sorting = target['value'];
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParamsHandling: 'merge',
      queryParams: this.isPaging ? { sorting, page: 1 } : { sorting },
      fragment: this.fragmentOnRouting,
    });
  }

  private mapSortableAttributesToSelectOptions(sortableAttributes: SortableAttributesType[] = []): SelectOption[] {
    const options = sortableAttributes
      .filter(x => !!x)
      .map(sk => ({ value: sk.name, label: sk.displayName || sk.name }))
      .sort((a, b) => a.label.localeCompare(b.label));
    options.unshift({ value: 'default', label: undefined });
    return options;
  }

  get simpleView() {
    return this.viewType === 'simple';
  }

  get detailedView() {
    return this.viewType === 'detailed';
  }

  applyFilter(event: { searchParameter: URLFormParams }) {
    const params = formParamsToString(event.searchParameter);
    this.router.navigate([], {
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute,
      queryParams: { filters: params, page: 1 },
      fragment: this.fragmentOnRouting,
    });
  }

  clearFilters() {
    this.router.navigate([], {
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute,
      queryParams: { filters: undefined, page: 1 },
      fragment: this.fragmentOnRouting,
    });
  }
}

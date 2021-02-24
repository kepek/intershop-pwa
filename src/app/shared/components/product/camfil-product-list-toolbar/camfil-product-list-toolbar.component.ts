import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isEqual } from 'lodash-es';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { ViewType } from 'ish-core/models/viewtype/viewtype.types';
import { URLFormParams, formParamsToString } from 'ish-core/utils/url-form-params';
import { SelectOption } from 'ish-shared/forms/components/select/select.component';

@Component({
  selector: 'camfil-product-list-toolbar',
  templateUrl: './camfil-product-list-toolbar.component.html',
  styleUrls: ['./camfil-product-list-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductListToolbarComponent implements OnInit, OnChanges, OnDestroy {
  @Input() itemCount: number;
  @Input() viewType: ViewType = 'simple';
  @Input() sortBy = 'default';
  @Input() sortKeys: string[];
  @Input() currentPage: number;
  @Input() pageIndices: number[];
  @Input() fragmentOnRouting: string;
  @Input() isPaging = false;
  @Input() categoryName: string;
  @Input() showCategoryFilter = false;

  sortDropdown = new FormControl('');
  sortOptions: SelectOption[] = [];
  filter$: Observable<FilterNavigation>;

  private destroy$ = new Subject();

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.filter$ = this.shoppingFacade.currentFilter$(this.showCategoryFilter);
    this.sortDropdown.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(sorting => {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParamsHandling: 'merge',
        queryParams: this.isPaging ? { sorting, page: 1 } : { sorting },
        fragment: this.fragmentOnRouting,
      });
    });
  }

  ngOnChanges(c: SimpleChanges) {
    if (c.sortKeys && !isEqual(c.sortKeys.currentValue, c.sortKeys.previousValue)) {
      this.updateSortKeys(c.sortKeys);
    }
    this.updateSortBy(c.sortBy);
  }

  private updateSortBy(sortBy: SimpleChange) {
    if (sortBy) {
      this.sortDropdown.setValue(this.sortBy || undefined, { emitEvent: false });
    }
  }

  private updateSortKeys(sortKeys: SimpleChange) {
    if (sortKeys) {
      this.sortOptions = this.mapSortKeysToSelectOptions(this.sortKeys);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private mapSortKeysToSelectOptions(sortKeys: string[]): SelectOption[] {
    // TODO: probably it's good to map this in a selector, not here
    return sortKeys.map(sk => ({ value: sk, label: sk }));
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

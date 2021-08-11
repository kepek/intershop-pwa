import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { ReplaySubject, Subject } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Category } from 'ish-core/models/category/category.model';
import { ProductListingID } from 'ish-core/models/product-listing/product-listing.model';
import { hideSearchBox } from 'ish-core/store/shopping/search';
import { whenTruthy } from 'ish-core/utils/operators';

interface SearchBoxConfiguration {
  /**
   * text for search button on search box, icon is used if no text is provided
   */
  buttonText?: string;
  /**
   * placeholder text for search input field
   */
  placeholder?: string;
  /**
   * if autoSuggest is set to true auto suggestion is provided for search box, else no auto suggestion is provided
   */
  autoSuggest?: boolean;
  /**
   * configures the number of suggestions if auto suggestion is provided
   */
  maxAutoSuggests?: number;
  /**
   * configure search box icon
   */
  icon?: string;
  /**
   * show last search term as search box value
   */
  showLastSearchTerm?: boolean;
}

/**
 * The search box container component
 *
 * prepares all data for the search box
 * uses input to display the search box
 *
 * @example
 * <camfil-search-box [configuration]="{placeholder: 'search.searchbox.instructional_text' | translate}"></camfil-search-box>
 */
@Component({
  selector: 'camfil-search-box',
  templateUrl: './camfil-search-box.component.html',
  styleUrls: ['./camfil-search-box.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilSearchBoxComponent implements OnInit, OnDestroy {
  /**
   * the search box configuration for this component
   */
  @Input() configuration?: SearchBoxConfiguration;
  @ViewChild('searchInput') searchInput: ElementRef;

  inputSearchTerms$ = new ReplaySubject<string>(1);

  inputFocused: boolean;
  isActive = false;
  loading = false;
  noResults = false;
  searchTerm: string;
  productListId: ProductListingID;
  categoriesTree: Category[];
  categoriesFiltered: Category[];
  // tslint:disable-next-line:force-jsdoc-comments
  // TODO: move and define in global settings ex. productListingSearchBoxItemsPerPage
  itemsOnSearchList = 5;

  private destroy$ = new Subject();

  constructor(
    private shoppingFacade: ShoppingFacade,
    private router: Router,
    private updates$: Actions,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.shoppingFacade.getAllCategoriesTree$.pipe(takeUntil(this.destroy$)).subscribe(list => {
      this.categoriesTree = Object.values(list);
    });

    this.shoppingFacade.searchTerm$?.pipe(whenTruthy(), take(1)).subscribe(term => {
      this.productListId = { type: 'search', page: 1, value: term };
      this.inputSearchTerms$.next(term);
    });
    // products are triggered solely via stream
    this.inputSearchTerms$.pipe(debounceTime(1000), takeUntil(this.destroy$)).subscribe(() => {
      if (this.productListId?.value) {
        this.shoppingFacade.searchProductsInSearchBox(this.productListId);
      }
    });

    this.updates$.pipe(ofType(hideSearchBox), takeUntil(this.destroy$)).subscribe(() => {
      if (this.router.url.indexOf('search') === -1) {
        this.clearResults();
      }
      this.out();

      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getFilteredCategories(searchTerm: string) {
    return this.categoriesTree.filter(item => item.name?.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 9);
  }

  focus() {
    this.inputFocused = true;
  }

  out() {
    this.inputFocused = false;
    this.searchInput.nativeElement.blur();
  }

  productListInfo(event) {
    if (event.lastPage === undefined) {
      this.noResults = true;
      this.loading = false;
    }
    if (!isNaN(event.lastPage)) {
      this.loading = false;
    }
  }

  searchResults(searchTerm: string) {
    if (searchTerm.length > 2) {
      this.setSearchTerm(searchTerm);
      this.noResults = false;
      this.loading = true;
    } else {
      this.productListId = { type: 'search', page: 1, value: '' };
      this.loading = false;
      this.noResults = true;
    }
  }

  clearResults() {
    this.shoppingFacade.setCurrentTerm('');
    this.setSearchTerm('', false);
    this.categoriesFiltered = [];
  }

  setSearchTerm(searchTerm, showCategoryBoxes = true) {
    this.inputSearchTerms$.next(searchTerm);
    this.productListId = { type: 'search', page: 1, value: searchTerm };
    if (showCategoryBoxes) {
      this.categoriesFiltered = this.getFilteredCategories(searchTerm);
    }
  }

  submitSearch(searchTerm: string) {
    if (searchTerm.length > 2) {
      this.out();
      this.shoppingFacade.setCurrentTerm(searchTerm);
      this.router.navigate(['/search', searchTerm]);
    }
    // prevent form submission
    return false;
  }
}

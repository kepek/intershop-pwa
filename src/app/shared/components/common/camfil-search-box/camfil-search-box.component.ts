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
import { debounceTime, takeUntil } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Category } from 'ish-core/models/category/category.model';
import { ProductListingID } from 'ish-core/models/product-listing/product-listing.model';
import { hideSearchBox } from 'ish-core/store/customer/basket';

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

    // products are triggered solely via stream
    this.inputSearchTerms$.pipe(debounceTime(1000), takeUntil(this.destroy$)).subscribe(() => {
      this.shoppingFacade.searchProductsInSearchBox(this.productListId);
    });

    this.updates$.pipe(ofType(hideSearchBox), takeUntil(this.destroy$)).subscribe(() => {
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
      this.inputSearchTerms$.next(searchTerm);
      this.categoriesFiltered = this.getFilteredCategories(searchTerm);
      this.productListId = { type: 'search', page: 1, value: searchTerm };
      this.noResults = false;
      this.loading = true;
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

import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Category } from 'ish-core/models/category/category.model';
import { ProductListingID } from 'ish-core/models/product-listing/product-listing.model';
import { SuggestTerm } from 'ish-core/models/suggest-term/suggest-term.model';

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

  searchResults$: Observable<SuggestTerm[]>;
  inputSearchTerms$ = new ReplaySubject<string>(1);

  inputFocused: boolean;
  isActive = false;
  loading = false;
  noResults = false;
  searchTerm: string;
  idToProdList: ProductListingID;
  categoriesTree: Category[];
  categoriesFiltered: Category[];
  // tslint:disable-next-line:force-jsdoc-comments
  // TODO: move and define in global settings ex. productListingSearchBoxItemsPerPage
  itemsOnSearchList = 5;

  private destroy$ = new Subject();

  constructor(private shoppingFacade: ShoppingFacade, private router: Router) {}

  ngOnInit() {
    this.shoppingFacade.getAllCategoriesTree$.pipe(takeUntil(this.destroy$)).subscribe(list => {
      this.categoriesTree = Object.values(list);
    });

    // suggests are triggered solely via stream
    this.searchResults$ = this.shoppingFacade.searchResults$(this.inputSearchTerms$);
    this.searchResults$.pipe(takeUntil(this.destroy$)).subscribe(results => {
      this.searchTerm = results.map(item => item.term).join(',');
      this.loading = false;
      if (this.searchTerm) {
        this.idToProdList = { type: 'search', page: 1, value: this.searchTerm };
        this.shoppingFacade.searchProductsInSearchBox(this.idToProdList);
      } else {
        this.noResults = true;
      }
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

  searchSuggest(searchTerm: string) {
    if (searchTerm.length > 2) {
      this.categoriesFiltered = this.getFilteredCategories(searchTerm);
      this.inputSearchTerms$.next(searchTerm);
      this.loading = true;
      this.noResults = false;
    }
  }

  submitSearch(suggestedTerm: string) {
    if (suggestedTerm) {
      this.out();
      this.router.navigate(['/search', this.searchTerm || suggestedTerm]);
    }

    // prevent form submission
    return false;
  }
}

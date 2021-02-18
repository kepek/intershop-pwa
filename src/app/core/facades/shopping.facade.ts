import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { debounce, filter, map, switchMap, tap } from 'rxjs/operators';

import { Address } from 'ish-core/models/address/address.model';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { BasketExtensions } from 'ish-core/models/basket/basket.interface';
import { CategoryHelper } from 'ish-core/models/category/category.helper';
import { ProductListingID } from 'ish-core/models/product-listing/product-listing.model';
import { ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.model';
import {
  addProductToBasket,
  addProductToBucket,
  addProductToBucketWithUrn,
  getBasketAddresses,
  getProductAdded,
  getProductUpdated,
  loadBasketAddresses,
  resetProductAdded,
  updateBucket,
} from 'ish-core/store/customer/basket';
import {
  getCategories,
  getCategory,
  getCategoryEntities,
  getNavigationCategories,
  getSelectedCategory,
  loadTopLevelCategories,
  updateCategory,
} from 'ish-core/store/shopping/categories';
import {
  addToCompare,
  getCompareProductsCount,
  getCompareProductsSKUs,
  isInCompareProducts,
  removeFromCompare,
  toggleCompare,
} from 'ish-core/store/shopping/compare';
import { getAvailableFilter } from 'ish-core/store/shopping/filter';
import {
  getProductListing,
  getProductListingLoading,
  getProductListingView,
  getProductListingViewType,
  loadMoreProducts,
} from 'ish-core/store/shopping/product-listing';
import {
  getProduct,
  getProductBundleParts,
  getProductLinks,
  getProductVariationCount,
  getProductVariationOptions,
  getProducts,
  getSelectedProduct,
  getSelectedProductVariationOptions,
  loadProductIfNotLoaded,
  loadProductLinks,
} from 'ish-core/store/shopping/products';
import { getPromotion, getPromotions, loadPromotion } from 'ish-core/store/shopping/promotions';
import {
  clearRecently,
  getMostRecentlyViewedProducts,
  getRecentlyViewedProducts,
} from 'ish-core/store/shopping/recently';
import {
  getCurrentTerm,
  getSearchTerm,
  getSuggestSearchResults,
  searchProductsInSearchBox,
  setCurrentTerm,
  suggestSearch,
} from 'ish-core/store/shopping/search';
import { toObservable } from 'ish-core/utils/functions';
import { whenFalsy, whenTruthy } from 'ish-core/utils/operators';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class ShoppingFacade {
  constructor(private store: Store) {}

  // CATEGORY

  selectedCategory$ = this.store.pipe(select(getSelectedCategory));

  category$(uniqueId: string) {
    return this.store.pipe(select(getCategory(uniqueId)));
  }

  navigationCategories$(uniqueId?: string) {
    if (!uniqueId) {
      this.store.dispatch(loadTopLevelCategories());
    }
    return this.store.pipe(select(getNavigationCategories(uniqueId)));
  }

  // PRODUCT

  selectedProduct$ = this.store.pipe(select(getSelectedProduct));
  selectedProductVariationOptions$ = this.store.pipe(select(getSelectedProductVariationOptions));
  productDetailLoading$ = this.selectedProduct$.pipe(
    map(p => !ProductHelper.isReadyForDisplay(p, ProductCompletenessLevel.Detail))
  );

  product$(sku: string | Observable<string>, level: ProductCompletenessLevel) {
    return toObservable(sku).pipe(
      tap(plainSKU => this.store.dispatch(loadProductIfNotLoaded({ sku: plainSKU, level }))),
      switchMap(plainSKU =>
        this.store.pipe(
          select(getProduct, { sku: plainSKU }),
          filter(p => ProductHelper.isReadyForDisplay(p, level))
        )
      )
    );
  }

  products$(skus: string[]) {
    return this.store.pipe(select(getProducts, { skus }));
  }

  productVariationOptions$(sku: string | Observable<string>) {
    return toObservable(sku).pipe(
      switchMap(plainSKU => this.store.pipe(select(getProductVariationOptions, { sku: plainSKU })))
    );
  }

  productVariationCount$(sku: string) {
    return toObservable(sku).pipe(
      switchMap(plainSKU => this.store.pipe(select(getProductVariationCount, { sku: plainSKU })))
    );
  }

  productBundleParts$(sku: string) {
    return this.store.pipe(select(getProductBundleParts, { sku }));
  }

  productNotReady$(sku$: Observable<string>, level: ProductCompletenessLevel) {
    return sku$.pipe(
      switchMap(sku =>
        this.store.pipe(
          select(getProduct, { sku }),
          map(p => !ProductHelper.isReadyForDisplay(p, level))
        )
      )
    );
  }

  // CHECKOUT

  addProductToBucket(
    address: Address,
    shippingMethod: string,
    sku: string,
    quantity: number,
    basketId: string,
    basketExtension: BasketExtensions,
    lineItemAttributes?: Attribute
  ) {
    this.store.dispatch(
      addProductToBucket({ address, shippingMethod, sku, quantity, basketId, basketExtension, lineItemAttributes })
    );
  }

  addProductToBucketWithUrn(
    urn: string,
    shippingMethod: string,
    addressId: string,
    sku: string,
    quantity: number,
    basketId: string,
    basketExtension: BasketExtensions,
    lineItemAttributes?: Attribute
  ) {
    this.store.dispatch(
      addProductToBucketWithUrn({
        urn,
        shippingMethod,
        addressId,
        sku,
        quantity,
        basketId,
        basketExtension,
        lineItemAttributes,
      })
    );
  }

  addProductToBasket(
    sku: string,
    quantity: number,
    shippingMethod?: string,
    shipToAddress?: string,
    lineItemAttributes?: Attribute
  ) {
    this.store.dispatch(addProductToBasket({ sku, quantity, shippingMethod, shipToAddress, lineItemAttributes }));
  }

  updateBucket(basketId: string, addressId: string, basketExtension: BasketExtensions, address?: Address) {
    this.store.dispatch(
      updateBucket({
        basketId,
        addressId,
        basketExtension,
        address,
      })
    );
  }

  resetProductAdded() {
    this.store.dispatch(resetProductAdded());
  }

  // PRODUCT LISTING

  productListingView$(id: ProductListingID) {
    return this.store.pipe(select(getProductListingView, id));
  }

  productListingViewType$ = this.store.pipe(select(getProductListingViewType));
  productListingLoading$ = this.store.pipe(select(getProductListingLoading));

  loadMoreProducts(id: ProductListingID, page: number) {
    this.store.dispatch(loadMoreProducts({ id, page }));
  }

  // PRODUCT LINKS

  productLinks$(sku: string) {
    this.store.dispatch(loadProductLinks({ sku }));
    return this.store.pipe(select(getProductLinks, { sku }));
  }

  // SEARCH

  searchTerm$ = this.store.pipe(select(getSearchTerm));
  searchResults$(searchTerm: Observable<string>) {
    return searchTerm.pipe(
      tap(term => this.store.dispatch(suggestSearch({ searchTerm: term }))),
      switchMap(term => this.store.pipe(select(getSuggestSearchResults(term))))
    );
  }
  searchLoading$ = this.store.pipe(select(getProductListingLoading));

  searchItemsCount$ = this.searchTerm$.pipe(
    debounce(() => this.store.pipe(select(getProductListingLoading), whenFalsy())),
    switchMap(term =>
      this.store.pipe(
        select(getProductListingView, { type: 'search', value: term }),
        map(view => view.itemCount)
      )
    )
  );

  // FILTER

  currentFilter$(withCategoryFilter: boolean) {
    return this.store.pipe(
      select(getAvailableFilter),
      whenTruthy(),
      map(x => (withCategoryFilter ? x : { ...x, filter: x.filter?.filter(f => f.id !== 'CategoryUUIDLevelMulti') }))
    );
  }

  // COMPARE

  compareProducts$ = this.store.pipe(select(getCompareProductsSKUs));
  compareProductsCount$ = this.store.pipe(select(getCompareProductsCount));

  inCompareProducts$(sku: string | Observable<string>) {
    return toObservable(sku).pipe(switchMap(plainSKU => this.store.pipe(select(isInCompareProducts(plainSKU)))));
  }

  addProductToCompare(sku: string) {
    this.store.dispatch(addToCompare({ sku }));
  }

  toggleProductCompare(sku: string) {
    this.store.dispatch(toggleCompare({ sku }));
  }

  removeProductFromCompare(sku: string) {
    this.store.dispatch(removeFromCompare({ sku }));
  }

  // RECENTLY

  recentlyViewedProducts$ = this.store.pipe(select(getRecentlyViewedProducts));
  mostRecentlyViewedProducts$ = this.store.pipe(select(getMostRecentlyViewedProducts));

  clearRecentlyViewedProducts() {
    this.store.dispatch(clearRecently());
  }

  // PROMOTIONS

  promotion$(promotionId: string) {
    this.store.dispatch(loadPromotion({ promoId: promotionId }));
    return this.store.pipe(select(getPromotion(), { promoId: promotionId }));
  }

  promotions$(promotionIds: string[]) {
    promotionIds.forEach(promotionId => {
      this.store.dispatch(loadPromotion({ promoId: promotionId }));
    });
    return this.store.pipe(select(getPromotions(), { promotionIds }));
  }

  // TODO: CAMFIL Additions, it should be separated to avoid core modifications;

  productAdded$ = this.store.pipe(select(getProductAdded));
  productUpdated$ = this.store.pipe(select(getProductUpdated));
  basketAddresses$ = this.store.pipe(select(getBasketAddresses));

  categories$(ids: string[]) {
    return this.store.pipe(
      select(getCategories(ids)),
      map(categories =>
        categories.filter(category => {
          if (!CategoryHelper.isCategoryCompletelyLoaded(category)) {
            const categoryId = category.uniqueId;
            this.store.dispatch(updateCategory({ categoryId }));
          } else {
            return categories;
          }
        })
      )
    );
  }

  activeFilters$() {
    return this.store.pipe(
      select(getAvailableFilter),
      whenTruthy(),
      map(x => ({ ...x, filter: [...x?.filter].filter(f => f.id !== 'CategoryUUIDLevelMulti') })),
      map(x =>
        x.filter
          .filter(z => z.facets.filter(y => y.selected).length)
          .map(o => ({
            name: o.name,
            picked: o.facets.filter(facet => facet.selected).map(single => single),
          }))
      )
    );
  }

  loadBasketAddresses() {
    this.store.dispatch(loadBasketAddresses());
  }

  searchProductsInSearchBox(id: ProductListingID) {
    this.store.dispatch(searchProductsInSearchBox({ id }));
  }

  getProductListing(id: ProductListingID) {
    return this.store.pipe(select(getProductListing, id));
  }

  getAllCategoriesTree$ = this.store.pipe(select(getCategoryEntities));

  getCurrentTerm$ = this.store.pipe(select(getCurrentTerm));

  setCurrentTerm(searchTerm: string) {
    this.store.dispatch(setCurrentTerm({ searchTerm }));
  }
}

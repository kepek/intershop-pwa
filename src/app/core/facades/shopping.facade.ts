// tslint:disable: ish-ordered-imports project-structure ban-specific-imports

import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { debounce, filter, map, switchMap, tap } from 'rxjs/operators';

import { Address } from 'ish-core/models/address/address.model';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { BasketExtension } from 'ish-core/models/basket/basket.interface';
import { CategoryHelper } from 'ish-core/models/category/category.helper';
import { ProductListingID } from 'ish-core/models/product-listing/product-listing.model';
import { ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.model';
import {
  addProductsFromCamCard,
  addProductToBasket,
  addProductToBucket,
  addProductToBucketWithUrn,
  createBasket,
  getBasketAddresses,
  getCurrentBasket,
  getFailedCamCardName,
  getProductAdded,
  getProductAddingError,
  getProductUpdated,
  isProductsReadyToPlaceOrder,
  loadBasketAddresses,
  resetProductAdded,
  updateBucket,
  updateBucketsQueue,
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
  getCustomerPrices,
  getProduct,
  getProductBundleParts,
  getProductLinks,
  getProducts,
  getProductVariationCount,
  getProductVariationOptions,
  getSelectedProduct,
  getSelectedProductVariationOptions,
  loadCustomerPrices,
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
  hideSearchBox,
  searchProductsInSearchBox,
  setCurrentTerm,
  suggestSearch,
} from 'ish-core/store/shopping/search';
import { toObservable } from 'ish-core/utils/functions';
import { whenFalsy, whenTruthy } from 'ish-core/utils/operators';

import { CamCamProductsAddToCartItems } from '../../extensions/cam-cards/models/cam-card/cam-card.model';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class ShoppingFacade {
  selectedCategory$ = this.store.pipe(select(getSelectedCategory));

  // CATEGORY
  selectedProduct$ = this.store.pipe(select(getSelectedProduct));
  selectedProductVariationOptions$ = this.store.pipe(select(getSelectedProductVariationOptions));
  productDetailLoading$ = this.selectedProduct$.pipe(
    map(p => !ProductHelper.isReadyForDisplay(p, ProductCompletenessLevel.Detail))
  );

  // PRODUCT
  productListingViewType$ = this.store.pipe(select(getProductListingViewType));
  productListingLoading$ = this.store.pipe(select(getProductListingLoading));
  searchTerm$ = this.store.pipe(select(getSearchTerm));
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
  compareProducts$ = this.store.pipe(select(getCompareProductsSKUs));
  compareProductsCount$ = this.store.pipe(select(getCompareProductsCount));
  recentlyViewedProducts$ = this.store.pipe(select(getRecentlyViewedProducts));
  mostRecentlyViewedProducts$ = this.store.pipe(select(getMostRecentlyViewedProducts));

  // CHECKOUT
  productAdded$ = this.store.pipe(select(getProductAdded));
  productUpdated$ = this.store.pipe(select(getProductUpdated));
  basketAddresses$ = this.store.pipe(select(getBasketAddresses));
  productsReadyToPlaceOrder$ = this.store.pipe(select(isProductsReadyToPlaceOrder));
  getProductAddingError$ = this.store.pipe(select(getProductAddingError));
  getFailedCamCardName$ = this.store.pipe(select(getFailedCamCardName));

  // PRODUCT LISTING
  getAllCategoriesTree$ = this.store.pipe(select(getCategoryEntities));
  getCurrentTerm$ = this.store.pipe(select(getCurrentTerm));

  constructor(private store: Store) {}

  category$(uniqueId: string) {
    return this.store.pipe(select(getCategory(uniqueId)));
  }

  // PRODUCT LINKS

  navigationCategories$(uniqueId?: string) {
    if (!uniqueId) {
      this.store.dispatch(loadTopLevelCategories());
    }
    return this.store.pipe(select(getNavigationCategories(uniqueId)));
  }

  // SEARCH

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

  // FILTER

  productBundleParts$(sku: string) {
    return this.store.pipe(select(getProductBundleParts, { sku }));
  }

  // COMPARE

  productNotReady$(sku: string | Observable<string>, level: ProductCompletenessLevel) {
    return toObservable(sku).pipe(
      switchMap(plainSKU =>
        this.store.pipe(
          select(getProduct, { sku: plainSKU }),
          whenTruthy(),
          map(p => !ProductHelper.isReadyForDisplay(p, level))
        )
      )
    );
  }

  addProductToBucket(
    address: Address,
    shippingMethod: string,
    sku: string,
    quantity: number,
    basketId: string,
    basketExtension: BasketExtension,
    lineItemAttributes?: Attribute[],
    bucketId?: string
  ) {
    this.store.dispatch(
      addProductToBucket({
        address,
        shippingMethod,
        sku,
        quantity,
        basketId,
        basketExtension,
        lineItemAttributes,
        bucketId,
      })
    );
  }

  addProductToBucketWithUrn(
    urn: string,
    addressId: string,
    shippingMethod: string,
    sku: string,
    quantity: number,
    basketId: string,
    lineItemAttributes?: Attribute[]
  ) {
    this.store.dispatch(
      addProductToBucketWithUrn({
        urn,
        shippingMethod,
        addressId,
        sku,
        quantity,
        basketId,
        lineItemAttributes,
      })
    );
  }

  addProductToBasket(
    sku: string,
    quantity: number,
    shippingMethod?: string,
    shipToAddress?: string,
    lineItemAttributes?: Attribute[]
  ) {
    this.store.dispatch(addProductToBasket({ sku, quantity, shippingMethod, shipToAddress, lineItemAttributes }));
  }

  updateBucket(basketId: string, addressId: string, basketExtension: BasketExtension, address?: Address) {
    this.store.dispatch(
      updateBucket({
        basketId,
        addressId,
        basketExtension,
        address,
      })
    );
  }

  updateBucketsQueue(buckets) {
    this.store.dispatch(updateBucketsQueue(buckets));
  }

  // RECENTLY

  resetProductAdded() {
    this.store.dispatch(resetProductAdded());
  }

  productListingView$(id: ProductListingID) {
    return this.store.pipe(select(getProductListingView, id));
  }

  loadMoreProducts(id: ProductListingID, page: number) {
    this.store.dispatch(loadMoreProducts({ id, page }));
  }

  // PROMOTIONS

  productLinks$(sku: string) {
    this.store.dispatch(loadProductLinks({ sku }));
    return this.store.pipe(select(getProductLinks, { sku }));
  }

  searchResults$(searchTerm: Observable<string>) {
    return searchTerm.pipe(
      tap(term => this.store.dispatch(suggestSearch({ searchTerm: term }))),
      switchMap(term => this.store.pipe(select(getSuggestSearchResults(term))))
    );
  }

  // TODO: CAMFIL Additions, it should be separated to avoid core modifications;

  currentFilter$(withCategoryFilter: boolean) {
    return this.store.pipe(
      select(getAvailableFilter),
      whenTruthy(),
      map(x => (withCategoryFilter ? x : { ...x, filter: x.filter?.filter(f => f.id !== 'CategoryUUIDLevelMulti') }))
    );
  }

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

  clearRecentlyViewedProducts() {
    this.store.dispatch(clearRecently());
  }

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

  loadBasketAddresses() {
    this.store.dispatch(loadBasketAddresses());
  }

  createBasket$() {
    this.store.dispatch(createBasket());
    return this.store.pipe(select(getCurrentBasket));
  }

  addProductsFromCamCard(
    itemsInfo: CamCamProductsAddToCartItems,
    commonShippingMethodId: string,
    basketId: string,
    camCardName?: string
  ) {
    this.store.dispatch(addProductsFromCamCard({ itemsInfo, commonShippingMethodId, basketId, camCardName }));
  }

  searchProductsInSearchBox(id: ProductListingID) {
    this.store.dispatch(searchProductsInSearchBox({ id }));
  }

  getProductListing(id: ProductListingID) {
    return this.store.pipe(select(getProductListing, id));
  }

  setCurrentTerm(searchTerm: string) {
    this.store.dispatch(setCurrentTerm({ searchTerm }));
  }

  loadCustomerPrices(customerId: string, skus: string[]) {
    this.store.dispatch(loadCustomerPrices({ customerId, skus }));
  }

  getCustomerPrices$(customerId: string) {
    return this.store.pipe(select(getCustomerPrices, { customerId }));
  }

  hideSearchBox() {
    this.store.dispatch(hideSearchBox());
  }
}

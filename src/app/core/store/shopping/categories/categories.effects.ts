import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { filter, map, mapTo, mergeMap, switchMap, switchMapTo, tap, withLatestFrom } from 'rxjs/operators';

import { MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH } from 'ish-core/configurations/injection-keys';
import { CategoryHelper } from 'ish-core/models/category/category.model';
import { ofCategoryUrl } from 'ish-core/routing/category/category.route';
import { CategoriesService } from 'ish-core/services/categories/categories.service';
import { setCurrentLocale } from 'ish-core/store/core/configuration';
import { selectRouteParam } from 'ish-core/store/core/router';
import { setBreadcrumbData } from 'ish-core/store/core/viewconf';
import { loadMoreProducts } from 'ish-core/store/shopping/product-listing';
import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';
import { mapErrorToAction, mapToPayloadProperty, mapToProperty, whenTruthy } from 'ish-core/utils/operators';

import {
  loadCategory,
  loadCategoryByRef,
  loadCategoryFail,
  loadCategorySuccess,
  loadTopLevelCategories,
  loadTopLevelCategoriesFail,
  loadTopLevelCategoriesSuccess,
  updateCategory,
  updateCategorySuccess,
} from './categories.actions';
import {
  getBreadcrumbForCategoryPage,
  getCategoryEntities,
  getCategoryRefs,
  getSelectedCategory,
} from './categories.selectors';

@Injectable()
export class CategoriesEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private categoryService: CategoriesService,
    @Inject(MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH) private mainNavigationMaxSubCategoriesDepth: number,
    private httpStatusCodeService: HttpStatusCodeService
  ) {}

  /**
   * listens to routing and fires {@link LoadCategory}
   * when the requested {@link Category} is not available, yet
   */
  selectedCategory$ = createEffect(() =>
    this.store.pipe(
      select(selectRouteParam('categoryUniqueId')),
      whenTruthy(),
      withLatestFrom(this.store.pipe(select(getCategoryEntities))),
      filter(([id, entities]) => !CategoryHelper.isCategoryCompletelyLoaded(entities[id])),
      map(([categoryId]) => loadCategory({ categoryId }))
    )
  );

  /**
   * listens to routing and fires {@link loadCategoryByRef}
   * when the requested ref in {@link getCategoryRefs} is not available, yet
   */
  selectedCategoryRef$ = createEffect(() =>
    this.store.pipe(
      select(selectRouteParam('categoryRefId')),
      whenTruthy(),
      withLatestFrom(this.store.pipe(select(getCategoryRefs)), this.store.pipe(select(getCategoryEntities))),
      filter(
        ([id, refs, entities]) =>
          !refs[id] || (refs[id] && !CategoryHelper.isCategoryCompletelyLoaded(entities[refs[id]]))
      ),
      map(([categoryRefId]) => loadCategoryByRef({ categoryRefId }))
    )
  );

  /**
   * fires {@link LoadCategory} for category path categories of the selected category that are not yet completely loaded
   */
  loadCategoriesOfCategoryPath$ = createEffect(() =>
    this.store.pipe(
      select(getSelectedCategory),
      filter(CategoryHelper.isCategoryCompletelyLoaded),
      mapToProperty('categoryPath'),
      withLatestFrom(this.store.pipe(select(getCategoryEntities))),
      map(([ids, entities]) => ids.filter(id => !CategoryHelper.isCategoryCompletelyLoaded(entities[id]))),
      mergeMap(ids => ids.map(categoryId => loadCategory({ categoryId })))
    )
  );

  /**
   * loads a {@link Category} using the {@link CategoriesService}
   */
  loadCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCategory),
      mapToPayloadProperty('categoryId'),
      mergeMap(categoryUniqueId =>
        this.categoryService.getCategory(categoryUniqueId).pipe(
          map(categories => loadCategorySuccess({ categories })),
          mapErrorToAction(loadCategoryFail)
        )
      )
    )
  );

  updateCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCategory),
      mapToPayloadProperty('categoryId'),
      mergeMap(uniqueId =>
        this.categoryService.getCategory(uniqueId).pipe(
          map(categories => updateCategorySuccess({ categories })),
          mapErrorToAction(loadCategoryFail)
        )
      )
    )
  );

  /**
   * loads a {@link Category} using the {@link CategoriesService}
   */
  loadCategoryByRef$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCategoryByRef),
      mapToPayloadProperty('categoryRefId'),
      mergeMap(categoryRefId =>
        this.categoryService.getCategory(categoryRefId).pipe(
          map(categories => loadCategorySuccess({ categories })),
          mapErrorToAction(loadCategoryFail)
        )
      )
    )
  );

  loadTopLevelCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTopLevelCategories),
      switchMap(() =>
        this.categoryService.getTopLevelCategories(this.mainNavigationMaxSubCategoriesDepth).pipe(
          map(categories => loadTopLevelCategoriesSuccess({ categories })),
          mapErrorToAction(loadTopLevelCategoriesFail)
        )
      )
    )
  );

  productOrCategoryChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      switchMapTo(
        this.store.pipe(
          ofCategoryUrl(),
          select(getSelectedCategory),
          whenTruthy(),
          // CAM-881: Skip below filter to also show products on main categories that have sub categories
          // filter(cat => cat.hasOnlineProducts),
          map(({ uniqueId }) => loadMoreProducts({ id: { type: 'category', value: uniqueId } }))
        )
      )
    )
  );

  redirectIfErrorInCategories$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadCategoryFail),
        tap(() => this.httpStatusCodeService.setStatusAndRedirect(404))
      ),
    { dispatch: false }
  );

  setBreadcrumbForCategoryPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      switchMapTo(
        this.store.pipe(
          ofCategoryUrl(),
          select(getBreadcrumbForCategoryPage),
          whenTruthy(),
          map(breadcrumbData => setBreadcrumbData({ breadcrumbData }))
        )
      )
    )
  );

  // Fetch and update category data (display names) when language is changed
  refreshCategories$ = createEffect(() =>
    this.actions$.pipe(ofType(setCurrentLocale), mapTo(loadTopLevelCategories()))
  );
}

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { Observable, ReplaySubject, Subject, of } from 'rxjs';
import { CamfilCategoryBoxComponent } from 'src/app/pages/camfil-category/camfil-category-box/camfil-category-box.component';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Category } from 'ish-core/models/category/category.model';
import { SuggestTerm } from 'ish-core/models/suggest-term/suggest-term.model';
import { HighlightPipe } from 'ish-core/pipes/highlight.pipe';
import { hideSearchBox } from 'ish-core/store/shopping/search';
import { CamfilLoadingComponent } from 'ish-shared/components/common/camfil-loading/camfil-loading.component';
import { CamfilProductListingComponent } from 'ish-shared/components/product/camfil-product-listing/camfil-product-listing.component';

import { CamfilSearchBoxComponent } from './camfil-search-box.component';

describe('Camfil Search Box Component', () => {
  let component: CamfilSearchBoxComponent;
  let fixture: ComponentFixture<CamfilSearchBoxComponent>;
  let element: HTMLElement;
  let getAllCategoriesTree$: Subject<{ [id: string]: Category }>;
  let searchResults$: Subject<SuggestTerm[]>;
  let actions$: Observable<Action>;

  beforeEach(async () => {
    searchResults$ = new ReplaySubject(1);
    getAllCategoriesTree$ = new ReplaySubject(1);
    searchResults$.next([]);
    getAllCategoriesTree$.next({});

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        CamfilSearchBoxComponent,
        MockComponent(CamfilCategoryBoxComponent),
        MockComponent(CamfilLoadingComponent),
        MockComponent(CamfilProductListingComponent),
        MockComponent(FaIconComponent),
        MockPipe(HighlightPipe),
      ],
      providers: [
        {
          provide: ShoppingFacade,
          useFactory: () =>
            ({ searchResults$: () => searchResults$, getAllCategoriesTree$ } as Partial<ShoppingFacade>),
        },
        provideMockActions(() => actions$),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilSearchBoxComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    // activate
    component.inputFocused = true;
    component.configuration = { maxAutoSuggests: 4 };
  });

  it('should be created', () => {
    const action = hideSearchBox();
    actions$ = of(action);

    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('with no results', () => {
    beforeEach(() => {
      searchResults$.next([]);
    });

    xit('should show no results when no suggestions are found', () => {
      fixture.detectChanges();

      const ul = element.querySelector('.search-suggest-results');
      expect(ul).toBeFalsy();
    });
  });

  describe('with results', () => {
    beforeEach(() => {
      searchResults$.next([{ term: 'Cameras' }, { term: 'Camcorders' }]);
    });

    xit('should show results when suggestions are available', () => {
      fixture.detectChanges();

      const ul = element.querySelector('.search-suggest-results');
      expect(ul.querySelectorAll('li')).toHaveLength(2);
    });

    xit('should show no results when suggestions are available but maxAutoSuggests is 0', () => {
      component.configuration.maxAutoSuggests = 0;
      fixture.detectChanges();

      const ul = element.querySelector('.search-suggest-results');
      expect(ul.querySelectorAll('li')).toHaveLength(0);
    });

    it('should show no results when suggestions are available but input has no focus', () => {
      component.inputFocused = false;
      fixture.detectChanges();

      expect(element.querySelector('.search-suggest-results')).toBeFalsy();
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { ReplaySubject, Subject } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { SuggestTerm } from 'ish-core/models/suggest-term/suggest-term.model';
import { HighlightPipe } from 'ish-core/pipes/highlight.pipe';

import { CamfilSearchBoxComponent } from './camfil-search-box.component';

describe('Camfil Search Box Component', () => {
  let component: CamfilSearchBoxComponent;
  let fixture: ComponentFixture<CamfilSearchBoxComponent>;
  let element: HTMLElement;
  let searchResults$: Subject<SuggestTerm[]>;
  let searchTerm$: Subject<string>;

  beforeEach(async () => {
    searchResults$ = new ReplaySubject(1);
    searchTerm$ = new ReplaySubject(1);
    searchResults$.next([]);
    searchTerm$.next(undefined);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [CamfilSearchBoxComponent, MockComponent(FaIconComponent), MockPipe(HighlightPipe)],
      providers: [
        {
          provide: ShoppingFacade,
          useFactory: () => ({ searchResults$: () => searchResults$, searchTerm$ } as Partial<ShoppingFacade>),
        },
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
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('with no results', () => {
    beforeEach(() => {
      searchResults$.next([]);
    });

    it('should show no results when no suggestions are found', () => {
      fixture.detectChanges();

      const ul = element.querySelector('.search-suggest-results');
      expect(ul).toBeFalsy();
    });
  });

  describe('with results', () => {
    beforeEach(() => {
      searchResults$.next([{ term: 'Cameras' }, { term: 'Camcorders' }]);
    });

    it('should show results when suggestions are available', () => {
      fixture.detectChanges();

      const ul = element.querySelector('.search-suggest-results');
      expect(ul.querySelectorAll('li')).toHaveLength(2);
    });

    it('should show no results when suggestions are available but maxAutoSuggests is 0', () => {
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

  describe('with inputs', () => {
    it('should show searchTerm when on search page', () => {
      searchTerm$.next('search');

      fixture.detectChanges();
      const input = element.querySelector('input');
      expect(input.value).toContain('search');
    });
  });
});

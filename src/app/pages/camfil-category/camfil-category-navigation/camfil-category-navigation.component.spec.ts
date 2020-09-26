import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { NavigationCategory } from 'ish-core/models/navigation-category/navigation-category.model';
import { CategoryRoutePipe } from 'ish-core/routing/category/category-route.pipe';

import { CamfilCategoryNavigationComponent } from './camfil-category-navigation.component';

describe('Camfil Category Navigation Component', () => {
  let component: CamfilCategoryNavigationComponent;
  let fixture: ComponentFixture<CamfilCategoryNavigationComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const shoppingFacade = mock(ShoppingFacade);
    const appFacade = mock(AppFacade);
    when(shoppingFacade.selectedCategory$).thenReturn(of({ uniqueId: 'A.1' }));
    when(shoppingFacade.navigationCategories$(undefined)).thenReturn(
      of([
        { uniqueId: 'A', name: 'nA', url: '/c/A' },
        { uniqueId: 'B', name: 'nB', url: '/c/B' },
      ] as NavigationCategory[])
    );
    when(shoppingFacade.navigationCategories$('A')).thenReturn(
      of([
        { uniqueId: 'A.1', name: 'nA.1', url: '/c/A/A.1' },
        { uniqueId: 'A.2', name: 'nA.2', url: '/c/A/A.2' },
      ] as NavigationCategory[])
    );
    when(shoppingFacade.navigationCategories$('B')).thenReturn(of([] as NavigationCategory[]));

    await TestBed.configureTestingModule({
      imports: [FontAwesomeModule, RouterTestingModule],
      declarations: [CamfilCategoryNavigationComponent, MockPipe(CategoryRoutePipe)],
      providers: [
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
        { provide: AppFacade, useFactory: () => instance(appFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilCategoryNavigationComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => component.ngOnChanges()).not.toThrow();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

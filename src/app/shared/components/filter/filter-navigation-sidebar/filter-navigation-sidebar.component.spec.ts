import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';
import { CamfilFilterCollapsableComponent } from 'ish-shared/components/filter/camfil-filter-collapsable/camfil-filter-collapsable.component';
import { CamfilFilterDropdownComponent } from 'ish-shared/components/filter/camfil-filter-dropdown/camfil-filter-dropdown.component';
import { CamfilFilterTextComponent } from 'ish-shared/components/filter/camfil-filter-text/camfil-filter-text.component';
import { FilterCheckboxComponent } from 'ish-shared/components/filter/filter-checkbox/filter-checkbox.component';
import { FilterSwatchImagesComponent } from 'ish-shared/components/filter/filter-swatch-images/filter-swatch-images.component';

import { FilterNavigationSidebarComponent } from './filter-navigation-sidebar.component';

describe('Filter Navigation Sidebar Component', () => {
  let component: FilterNavigationSidebarComponent;
  let fixture: ComponentFixture<FilterNavigationSidebarComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FilterNavigationSidebarComponent,
        MockComponent(CamfilFilterCollapsableComponent),
        MockComponent(CamfilFilterDropdownComponent),
        MockComponent(CamfilFilterTextComponent),
        MockComponent(FilterCheckboxComponent),
        MockComponent(FilterSwatchImagesComponent),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterNavigationSidebarComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not display anything when filter is not set', () => {
    fixture.detectChanges();
    expect(findAllIshElements(element)).toBeEmpty();
  });
});

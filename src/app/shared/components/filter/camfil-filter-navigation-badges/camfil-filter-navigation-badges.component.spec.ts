import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { Filter } from 'ish-core/models/filter/filter.model';

import { CamfilFilterNavigationBadgesComponent } from './camfil-filter-navigation-badges.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('Camfil Filter Navigation Badges Component', () => {
  let component: CamfilFilterNavigationBadgesComponent;
  let fixture: ComponentFixture<CamfilFilterNavigationBadgesComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [CamfilFilterNavigationBadgesComponent, MockComponent(FaIconComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilFilterNavigationBadgesComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    const facet = (n, value, selected) => ({
      name: value,
      searchParameter: { [n]: value },
      displayName: value,
      count: 0,
      selected,
      level: 0,
    });
    component.filterNavigation = {
      filter: [
        {
          name: 'Color',
          facets: [facet('Color', 'red', false), facet('Color', 'blue', true), facet('Color', 'black', true)],
        },
        {
          name: 'HDD',
          facets: [facet('HDD', '123', false), facet('HDD', '456', true)],
        },
      ] as Filter[],
    } as FilterNavigation;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

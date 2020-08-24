import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MockComponent } from 'ng-mocks';

import { Facet } from 'ish-core/models/facet/facet.model';
import { Filter } from 'ish-core/models/filter/filter.model';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { CamfilFilterDropdownComponent } from './camfil-filter-dropdown.component';

describe('Filter Dropdown Component', () => {
  let component: CamfilFilterDropdownComponent;
  let fixture: ComponentFixture<CamfilFilterDropdownComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatCheckboxModule],
      declarations: [CamfilFilterDropdownComponent, MockComponent(FaIconComponent)],
    }).compileComponents();
  }));

  const facet = (n, value) => ({
    name: value,
    searchParameter: { [n]: value },
    displayName: value,
    count: 0,
    selected: false,
    level: 0,
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilFilterDropdownComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.filterElement = {
      name: 'Color',
      id: 'Color_of_Product',
      facets: [facet('Color_of_Product', 'red'), { ...facet('Color_of_Product', 'blue'), selected: true }] as Facet[],
    } as Filter;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

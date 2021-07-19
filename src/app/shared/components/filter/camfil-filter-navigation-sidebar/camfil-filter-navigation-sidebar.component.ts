import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { URLFormParams } from 'ish-core/utils/url-form-params';

@Component({
  selector: 'camfil-filter-navigation-sidebar',
  templateUrl: './camfil-filter-navigation-sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilFilterNavigationSidebarComponent {
  @Input() filterNavigation: FilterNavigation;
  @Output() applyFilter = new EventEmitter<{ searchParameter: URLFormParams }>();

  /**
   * keeps the collapsed state of subcomponents when changing filters
   */
  collapsedElements = {};

  /**
   * keeps the show all state of subcomponents when changing filters
   */
  showAllElements = {};

  hasResults(facets) {
    return facets?.some(facet => facet?.count > 0);
  }
}

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Facet } from 'ish-core/models/facet/facet.model';
import { Filter } from 'ish-core/models/filter/filter.model';
import { URLFormParams } from 'ish-core/utils/url-form-params';

@Component({
  selector: 'camfil-filter-dropdown',
  templateUrl: './camfil-filter-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./camfil-filter-dropdown.component.scss'],
})
export class CamfilFilterDropdownComponent implements OnInit {
  @Input() filterElement: Filter;
  @Input() placeholderType: 'groupName' | 'selectedFacets' = 'groupName';
  @Output() applyFilter: EventEmitter<{ searchParameter: URLFormParams }> = new EventEmitter();

  placeholder = '';
  selectedFacets: Facet[] = [];

  apply(facet: Facet) {
    this.applyFilter.emit({ searchParameter: facet.searchParameter });
  }

  trackByFn(_, item: Facet) {
    return item.name;
  }

  ngOnInit() {
    this.initPlaceHolder();
  }

  initPlaceHolder() {
    this.placeholder = this.filterElement.name;

    this.selectedFacets = this.filterElement.facets.filter(x => x.selected);

    if (this.placeholderType === 'selectedFacets') {
      const placeholder = this.selectedFacets.map(x => x.displayName).join(', ');

      if (placeholder) {
        this.placeholder = placeholder;
      }
    }
  }
}

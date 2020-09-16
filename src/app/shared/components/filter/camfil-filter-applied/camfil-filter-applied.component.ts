import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Facet } from 'ish-core/models/facet/facet.model';
import { URLFormParams, formParamsToString } from 'ish-core/utils/url-form-params';

@Component({
  selector: 'camfil-filter-applied',
  templateUrl: './camfil-filter-applied.component.html',
  styleUrls: ['./camfil-filter-applied.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilFilterAppliedComponent implements OnInit {
  filters$;

  @Input() fragmentOnRouting: string;
  constructor(private shoppingFacade: ShoppingFacade, private router: Router, private activatedRoute: ActivatedRoute) {}

  disable(facet: Facet) {
    this.applyFilter({ searchParameter: facet.searchParameter });
  }

  disableAll() {
    this.applyFilter({ searchParameter: {} });
  }

  applyFilter(event: { searchParameter: URLFormParams }) {
    const params = formParamsToString(event.searchParameter);
    this.router.navigate([], {
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute,
      queryParams: { filters: params, page: 1 },
      fragment: this.fragmentOnRouting,
    });
  }

  ngOnInit() {
    this.filters$ = this.shoppingFacade.activeFilters$();
  }
}

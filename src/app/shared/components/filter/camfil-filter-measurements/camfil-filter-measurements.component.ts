import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { URLFormParams } from 'ish-core/utils/url-form-params';

@Component({
  selector: 'camfil-filter-measurements',
  templateUrl: './camfil-filter-measurements.component.html',
  styleUrls: ['./camfil-filter-measurements.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilFilterMeasurementsComponent {
  width = '0';
  height = '0';
  depth = '0';
  @Input() fragmentOnRouting: string;
  @Output() applyFilter: EventEmitter<{ searchParameter: URLFormParams }> = new EventEmitter();

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  filter(facet, type) {
    this[type] = facet;
    if (+this.width && +this.height && +this.depth) {
      this.router.navigate([], {
        queryParamsHandling: 'merge',
        relativeTo: this.activatedRoute,
        queryParams: { filters: `width=${this.width},height=${this.height},depth=${this.depth}` },
        fragment: this.fragmentOnRouting,
      });
    }
  }
}

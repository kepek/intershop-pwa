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

    const filter = [
      `attr_width%5Bgte%5D=${+this.width - 10}&attr_width%5Blte%5D=${+this.width + 10}`,
      `attr_height%5Bgte%5D=${+this.height - 10}&attr_height%5Blte%5D=${+this.height + 10}`,
      `attr_depth%5Bgte%5D=${+this.depth - 50}&attr_depth%5Blte%5D=${+this.depth + 50}`,
    ].join('&');

    if (+this.width && +this.height && +this.depth) {
      this.router.navigate([], {
        queryParamsHandling: 'merge',
        relativeTo: this.activatedRoute,
        queryParams: {
          filters: filter,
        },
        fragment: this.fragmentOnRouting,
      });
    }
  }
}

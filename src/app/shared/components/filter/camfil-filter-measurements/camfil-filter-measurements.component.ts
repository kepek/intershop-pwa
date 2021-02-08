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
  width;
  height;
  depth;
  @Input() fragmentOnRouting: string;
  @Output() applyFilter: EventEmitter<{ searchParameter: URLFormParams }> = new EventEmitter();

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  change(facet, type) {
    this[type] = facet;
  }

  filter() {
    const filter = [
      !!this.width && `Width%5Bgte%5D=${this.width - 10}&Width%5Blte%5D=${+this.width + 10}`,
      !!this.height && `Height%5Bgte%5D=${+this.height - 10}&Height%5Blte%5D=${+this.height + 10}`,
      !!this.depth && `Depth%5Bgte%5D=${+this.depth - 50}&Depth%5Blte%5D=${+this.depth + 50}`,
    ].join('&');

    if (+this.width || +this.height || +this.depth) {
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

  isDisabled() {
    return this.width || this.height || this.depth ? !1 : !0;
  }
}

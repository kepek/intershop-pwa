import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { whenTruthy } from 'ish-core/utils/operators';
import { URLFormParams } from 'ish-core/utils/url-form-params';

@Component({
  selector: 'camfil-filter-measurements',
  templateUrl: './camfil-filter-measurements.component.html',
  styleUrls: ['./camfil-filter-measurements.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilFilterMeasurementsComponent implements OnInit, OnDestroy {
  width;
  height;
  depth;
  @Input() fragmentOnRouting: string;
  @Output() applyFilter: EventEmitter<{ searchParameter: URLFormParams }> = new EventEmitter();
  filters: URLSearchParams;
  showCategoryFilter = false;
  private destroy$ = new Subject();

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    // make sure we see the latest queryParams when subscribing to the route in ngOnInit
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(params => {
      this.filters = new URLSearchParams(decodeURIComponent(params.filters));
      this.width = this.calculateFilterValue('Width');
      this.height = this.calculateFilterValue('Height');
      this.depth = this.calculateFilterValue('Depth');
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  calculateFilterValue(name: string) {
    const lowerBound = parseInt(this.filters.get(name + '[gte]'), 10);
    const upperBound = parseInt(this.filters.get(name + '[lte]'), 10);
    if (!isNaN(lowerBound) && !isNaN(upperBound)) {
      return (lowerBound + upperBound) / 2;
    } else {
      return;
    }
  }

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

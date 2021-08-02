import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { BreadcrumbItem } from 'ish-core/models/breadcrumb-item/breadcrumb-item.interface';

/**
 * component for setting the breadcrumb trail of a specific page
 *
 * Breadcrumbs can be set in two specific ways:
 * - setting the 'breadcrumbData' field as routing data
 * - dispatching a setBreadcrumbData action in an effect
 */
@Component({
  selector: 'camfil-breadcrumb',
  templateUrl: './camfil-breadcrumb.component.html',
  styleUrls: ['./camfil-breadcrumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilBreadcrumbComponent implements OnInit {
  @Input() separator = '❭';
  @Input() showHome = true;
  @Input() checkout: boolean;
  @Input() url: string;
  @Input() productDetail: boolean;

  trail$: Observable<BreadcrumbItem[]>;
  filterParams;

  constructor(private appFacade: AppFacade, private router: Router) {}

  ngOnInit() {
    this.trail$ = this.appFacade.breadcrumbData$;

    this.router.events.pipe().subscribe(val => {
      if (val instanceof ActivationEnd) {
        this.filterParams = val.snapshot.queryParams?.filters?.split('&category')[0].split('&productFilter')[0];
      }
    });
  }

  getFilterParams() {
    if (!this.filterParams) {
      return {};
    } else {
      return { filters: this.filterParams };
    }
  }
}

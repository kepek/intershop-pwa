import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
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
export class CamfilBreadcrumbComponent implements OnInit, OnChanges {
  @Input() separator = '❭';
  @Input() showHome = true;
  @Input() account: boolean;
  @Input() checkout: boolean;
  @Input() url: string;
  hideOnHome = true;

  trail$: Observable<BreadcrumbItem[]>;

  constructor(private appFacade: AppFacade) {}

  ngOnInit() {
    this.trail$ = this.appFacade.breadcrumbData$;
    this.toggleBreadcrumbs();
  }

  ngOnChanges() {
    this.toggleBreadcrumbs();
  }

  toggleBreadcrumbs() {
    this.hideOnHome = this.url === '/' || this.url === '/home' ? true : false;
  }
}

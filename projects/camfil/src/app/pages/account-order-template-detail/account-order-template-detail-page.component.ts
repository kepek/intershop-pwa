import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'camfil-account-order-template-detail-page',
  templateUrl: './account-order-template-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOrderTemplateDetailPageComponent {
  orderTemplateName: string;

  constructor(private route: ActivatedRoute) {
    this.orderTemplateName = this.route.snapshot.paramMap.get('orderTemplateName');
  }
}

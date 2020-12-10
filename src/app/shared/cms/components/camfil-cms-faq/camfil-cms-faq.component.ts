import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ContentViewHelper } from 'ish-core/models/content-view/content-view.helper';
import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { CMSComponent } from 'ish-shared/cms/models/cms-component/cms-component.model';

@Component({
  selector: 'camfil-cms-faq',
  templateUrl: './camfil-cms-faq.component.html',
  styleUrls: ['./camfil-cms-faq.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCmsFaqComponent implements CMSComponent {
  @Input() pagelet: ContentPageletView;

  isRouterLink = ContentViewHelper.isRouterLink;
  routerLink = ContentViewHelper.getRouterLink;

  /**
   * deferred loading flag
   */
  showImage = true;
}

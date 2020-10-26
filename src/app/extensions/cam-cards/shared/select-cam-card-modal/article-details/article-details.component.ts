import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Product } from 'ish-core/models/product/product.model';

@Component({
  selector: 'camfil-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleDetailsComponent {
  @Input() product: Product;

  @Input() quantityForm: FormGroup;
}

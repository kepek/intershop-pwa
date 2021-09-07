import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';

import { CamfilMaxLengthAttributeCreateDirective } from 'ish-core/directives/camfil-max-length-attribute-create.directive';
import { Product } from 'ish-core/models/product/product.model';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { CamfilProductQuantityComponent } from 'ish-shared/components/product/camfil-product-quantity/camfil-product-quantity.component';
import { CamfilCounterComponent } from 'ish-shared/forms/components/camfil-counter/camfil-counter.component';

import { ArticleDetailsComponent } from './article-details.component';

describe('Article Details Component', () => {
  let component: ArticleDetailsComponent;
  let fixture: ComponentFixture<ArticleDetailsComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ArticleDetailsComponent,
        CamfilCounterComponent,
        CamfilErrorComponent,
        CamfilMaxLengthAttributeCreateDirective,
        CamfilProductQuantityComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleDetailsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.quantityForm = new FormGroup({
      quantity: new FormControl(1),
      boxLabel: new FormControl(),
    });

    component.product = { name: 'Test Product', sku: 'test sku', minOrderQuantity: 1, inStock: true } as Product;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

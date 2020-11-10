import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleDetailsComponent } from './article-details.component';
import {CamfilProductQuantityComponent} from "ish-shared/components/product/camfil-product-quantity/camfil-product-quantity.component";
import {CamfilCounterComponent} from "ish-shared/forms/components/camfil-counter/camfil-counter.component";
import {FormControl, FormGroup} from "@angular/forms";
import {Product} from "ish-core/models/product/product.model";

describe('Article Details Component', () => {
  let component: ArticleDetailsComponent;
  let fixture: ComponentFixture<ArticleDetailsComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticleDetailsComponent, CamfilProductQuantityComponent, CamfilCounterComponent],
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

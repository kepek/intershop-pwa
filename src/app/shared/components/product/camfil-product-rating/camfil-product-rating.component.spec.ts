import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MockComponents } from 'ng-mocks';

import { Product } from 'ish-core/models/product/product.model';
import { CamfilProductRatingStarComponent } from 'ish-shared/components/product/camfil-product-rating-star/camfil-product-rating-star.component';

import { CamfilProductRatingComponent } from './camfil-product-rating.component';

describe('Camfil Product Rating Component', () => {
  let component: CamfilProductRatingComponent;
  let fixture: ComponentFixture<CamfilProductRatingComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CamfilProductRatingComponent, MockComponents(CamfilProductRatingStarComponent)],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilProductRatingComponent);
    component = fixture.componentInstance;
    component.product = { roundedAverageRating: 3.5 } as Product;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchInlineSnapshot(`
      <div>
        <camfil-product-rating-star
          ng-reflect-filled="full"
          ng-reflect-last-star="false"
        ></camfil-product-rating-star
        ><camfil-product-rating-star
          ng-reflect-filled="full"
          ng-reflect-last-star="false"
        ></camfil-product-rating-star
        ><camfil-product-rating-star
          ng-reflect-filled="full"
          ng-reflect-last-star="false"
        ></camfil-product-rating-star
        ><camfil-product-rating-star
          ng-reflect-filled="half"
          ng-reflect-last-star="false"
        ></camfil-product-rating-star
        ><camfil-product-rating-star
          ng-reflect-filled="empty"
          ng-reflect-last-star="true"
        ></camfil-product-rating-star
        ><span class="product-info ml-1">(3.5)</span>
      </div>
    `);
  });
});

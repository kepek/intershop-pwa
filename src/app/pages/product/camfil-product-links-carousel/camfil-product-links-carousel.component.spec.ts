import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { SwiperModule } from 'ngx-swiper-wrapper';

import { ProductLinkView } from 'ish-core/models/product-links/product-links.model';
import { CamfilProductItemComponent } from 'ish-shared/components/product/camfil-product-item/camfil-product-item.component';

import { CamfilProductLinksCarouselComponent } from './camfil-product-links-carousel.component';

describe('Camfil Product Links Carousel Component', () => {
  let component: CamfilProductLinksCarouselComponent;
  let fixture: ComponentFixture<CamfilProductLinksCarouselComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwiperModule],
      declarations: [CamfilProductLinksCarouselComponent, MockComponent(CamfilProductItemComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    const productLink = { productSKUs: ['sku'], categoryIds: ['catID'] } as ProductLinkView;

    fixture = TestBed.createComponent(CamfilProductLinksCarouselComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.links = productLink;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

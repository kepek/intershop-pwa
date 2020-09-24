import { ComponentFixture, TestBed } from '@angular/core/testing';
import { instance, mock, when } from 'ts-mockito';

import { CamfilProductItemComponent } from 'ish-shared/components/product/camfil-product-item/camfil-product-item.component';
import { EMPTY } from 'rxjs';
import { LARGE_BREAKPOINT_WIDTH } from 'ish-core/configurations/injection-keys';
import { MockComponent } from 'ng-mocks';
import { RouterTestingModule } from '@angular/router/testing';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { TranslateModule } from '@ngx-translate/core';
import { WishlistWidgetComponent } from './wishlist-widget.component';
import { WishlistsFacade } from '../../facades/wishlists.facade';

describe('Wishlist Widget Component', () => {
  let component: WishlistWidgetComponent;
  let fixture: ComponentFixture<WishlistWidgetComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const wishlistFacadeMock = mock(WishlistsFacade);
    when(wishlistFacadeMock.allWishlistsItemsSkus$).thenReturn(EMPTY);

    await TestBed.configureTestingModule({
      declarations: [MockComponent(ProductItemComponent), WishlistWidgetComponent],
      imports: [RouterTestingModule, SwiperModule, TranslateModule.forRoot()],
      providers: [
        { provide: WishlistsFacade, useFactory: () => instance(wishlistFacadeMock) },
        { provide: LARGE_BREAKPOINT_WIDTH, useValue: 992 },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WishlistWidgetComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

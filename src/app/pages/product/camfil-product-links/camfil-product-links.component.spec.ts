import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { LARGE_BREAKPOINT_WIDTH } from 'ish-core/configurations/injection-keys';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { CamfilProductItemComponent } from 'ish-shared/components/product/camfil-product-item/camfil-product-item.component';

import { CamfilProductLinksCarouselComponent } from '../camfil-product-links-carousel/camfil-product-links-carousel.component';
import { ProductLinksListComponent } from '../product-links-list/product-links-list.component';

import { CamfilProductLinksComponent } from './camfil-product-links.component';

describe('Camfil Product Links Component', () => {
  let component: CamfilProductLinksComponent;
  let fixture: ComponentFixture<CamfilProductLinksComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        CamfilProductLinksComponent,
        MockComponent(CamfilProductItemComponent),
        MockComponent(CamfilProductLinksCarouselComponent),
        MockComponent(ProductLinksListComponent),
      ],
      providers: [
        { provide: LARGE_BREAKPOINT_WIDTH, useValue: 992 },
        { provide: ShoppingFacade, useFactory: () => instance(mock(ShoppingFacade)) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilProductLinksComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => component.ngOnChanges()).not.toThrow();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

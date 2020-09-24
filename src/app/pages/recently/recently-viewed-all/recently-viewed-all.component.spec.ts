import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamfilProductItemComponent } from 'ish-shared/components/product/camfil-product-item/camfil-product-item.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { MockComponent } from 'ng-mocks';
import { RecentlyViewedAllComponent } from './recently-viewed-all.component';
import { TranslateModule } from '@ngx-translate/core';

describe('Recently Viewed All Component', () => {
  let component: RecentlyViewedAllComponent;
  let fixture: ComponentFixture<RecentlyViewedAllComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(CamfilProductItemComponent),
        MockComponent(LoadingComponent),
        RecentlyViewedAllComponent,
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentlyViewedAllComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.products = ['sku'];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockPipe } from 'ng-mocks';

import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { ProductRoutePipe } from 'ish-core/routing/product/product-route.pipe';

import { CamfilProductCategoryLabelComponent } from './camfil-product-category-label.component';

describe('Camfil Product Category Label Component', () => {
  let category: CategoryView;
  let component: CamfilProductCategoryLabelComponent;
  let fixture: ComponentFixture<CamfilProductCategoryLabelComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilProductCategoryLabelComponent, MockPipe(ProductRoutePipe)],
      imports: [RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilProductCategoryLabelComponent);
    category = { name: 'name' } as CategoryView;
    component = fixture.componentInstance;
    component.category = category;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

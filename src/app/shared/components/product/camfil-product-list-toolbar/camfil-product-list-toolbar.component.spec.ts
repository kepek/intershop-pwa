import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { CamfilFilterAppliedComponent } from 'ish-shared/components/filter/camfil-filter-applied/camfil-filter-applied.component';
import { ProductListPagingComponent } from 'ish-shared/components/product/product-list-paging/product-list-paging.component';

import { CamfilProductListToolbarComponent } from './camfil-product-list-toolbar.component';

describe('Camfil Product List Toolbar Component', () => {
  let component: CamfilProductListToolbarComponent;
  let fixture: ComponentFixture<CamfilProductListToolbarComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CamfilProductListToolbarComponent,
        MockComponent(CamfilFilterAppliedComponent),
        MockComponent(FaIconComponent),
        MockComponent(ProductListPagingComponent),
      ],
      imports: [ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilProductListToolbarComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

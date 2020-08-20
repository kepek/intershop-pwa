// tslint:disable:ish-ordered-imports
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MockComponent } from 'ng-mocks';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import { ProductListPagingComponent } from 'ish-shared/components/product/product-list-paging/product-list-paging.component';

import { CamfilFilterAppliedComponent } from '../../filter/camfil-filter-applied/camfil-filter-applied.component';

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
      imports: [MatChipsModule, MatIconModule, ReactiveFormsModule, RouterTestingModule, MatSelectModule, MatRadioModule, TranslateModule.forRoot()],
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

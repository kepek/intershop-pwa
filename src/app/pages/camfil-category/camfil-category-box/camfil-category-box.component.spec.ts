import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { CategoryView } from 'ish-core/models/category-view/category-view.model';

import { CamfilCategoryBoxComponent } from './camfil-category-box.component';

describe('Camfil Category Box Component', () => {
  let component: CamfilCategoryBoxComponent;
  let fixture: ComponentFixture<CamfilCategoryBoxComponent>;
  let element: HTMLElement;
  let translate: TranslateService;

  const category = {
    uniqueId: 'A',
    categoryPath: ['A'],
    images: [
      {
        type: 'Image',
        effectiveUrl: '/assets/product_img/a.jpg',
        primaryImage: false,
      },
    ],
    name: 'A',
  } as CategoryView;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CamfilCategoryBoxComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilCategoryBoxComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.category = category;

    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

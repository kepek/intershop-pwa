import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { CamfilCategoryBoxComponent } from '../camfil-category-box/camfil-category-box.component';

import { CamfilCategoryBoxesComponent } from './camfil-category-boxes.component';

describe('Camfil Category Boxes Component', () => {
  let component: CamfilCategoryBoxesComponent;
  let fixture: ComponentFixture<CamfilCategoryBoxesComponent>;
  let element: HTMLElement;
  let translate: TranslateService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CamfilCategoryBoxComponent, CamfilCategoryBoxesComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilCategoryBoxesComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

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

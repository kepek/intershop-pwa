import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { CamfilCategoryFaqComponent } from './camfil-category-faq.component';

describe('Camfil Category Faq Component', () => {
  let component: CamfilCategoryFaqComponent;
  let fixture: ComponentFixture<CamfilCategoryFaqComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CamfilCategoryFaqComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilCategoryFaqComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

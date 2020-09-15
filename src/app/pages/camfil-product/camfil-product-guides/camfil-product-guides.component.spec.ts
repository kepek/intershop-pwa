import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { CamfilProductGuidesComponent } from './camfil-product-guides.component';
import { TranslateModule } from '@ngx-translate/core';

describe('Camfil Product Guides Component', () => {
  let component: CamfilProductGuidesComponent;
  let fixture: ComponentFixture<CamfilProductGuidesComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CamfilProductGuidesComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilProductGuidesComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

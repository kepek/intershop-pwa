import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamfilProductBadgesComponent } from './camfil-product-badges.component';

describe('Camfil Product Badges Component', () => {
  let component: CamfilProductBadgesComponent;
  let fixture: ComponentFixture<CamfilProductBadgesComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilProductBadgesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilProductBadgesComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

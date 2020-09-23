import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { CamfilBannerComponent } from './camfil-banner.component';

describe('Camfil Banner Component', () => {
  let component: CamfilBannerComponent;
  let fixture: ComponentFixture<CamfilBannerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CamfilBannerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilBannerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

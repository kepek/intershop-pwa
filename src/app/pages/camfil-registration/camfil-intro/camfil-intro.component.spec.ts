import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { CamfilIntroComponent } from './camfil-intro.component';

describe('CamfilIntroComponent', () => {
  let component: CamfilIntroComponent;
  let fixture: ComponentFixture<CamfilIntroComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CamfilIntroComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilIntroComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

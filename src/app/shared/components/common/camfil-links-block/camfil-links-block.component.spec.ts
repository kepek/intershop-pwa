import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { CamfilLinksBlockComponent } from './camfil-links-block.component';

describe('Camfil Links Block Component', () => {
  let component: CamfilLinksBlockComponent;
  let fixture: ComponentFixture<CamfilLinksBlockComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CamfilLinksBlockComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilLinksBlockComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

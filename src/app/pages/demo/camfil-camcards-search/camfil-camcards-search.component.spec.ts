import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { CamfilCamcardsSearchComponent } from './camfil-camcards-search.component';

describe('Camfil Camcards Search Component', () => {
  let component: CamfilCamcardsSearchComponent;
  let fixture: ComponentFixture<CamfilCamcardsSearchComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CamfilCamcardsSearchComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilCamcardsSearchComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

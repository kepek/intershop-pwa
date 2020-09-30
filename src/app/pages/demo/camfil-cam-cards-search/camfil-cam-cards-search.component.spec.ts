import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamfilCamCardsSearchComponent } from './camfil-cam-cards-search.component';

describe('Camfil Cam Cards Search Component', () => {
  let component: CamfilCamCardsSearchComponent;
  let fixture: ComponentFixture<CamfilCamCardsSearchComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilCamcardsSearchComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilCamCardsSearchComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

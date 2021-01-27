import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamfilProductTechnicalDocumentsComponent } from './camfil-product-technical-documents.component';

describe('Camfil Product Technical Documents Component', () => {
  let component: CamfilProductTechnicalDocumentsComponent;
  let fixture: ComponentFixture<CamfilProductTechnicalDocumentsComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilProductTechnicalDocumentsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilProductTechnicalDocumentsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

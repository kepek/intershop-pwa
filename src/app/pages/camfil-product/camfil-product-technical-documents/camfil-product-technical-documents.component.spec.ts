import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { ContentViewcontextComponent } from 'ish-shared/cms/components/content-viewcontext/content-viewcontext.component';

import { CamfilProductTechnicalDocumentsComponent } from './camfil-product-technical-documents.component';

describe('Camfil Product Technical Documents Component', () => {
  let component: CamfilProductTechnicalDocumentsComponent;
  let fixture: ComponentFixture<CamfilProductTechnicalDocumentsComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilProductTechnicalDocumentsComponent, MockComponent(ContentViewcontextComponent)],
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

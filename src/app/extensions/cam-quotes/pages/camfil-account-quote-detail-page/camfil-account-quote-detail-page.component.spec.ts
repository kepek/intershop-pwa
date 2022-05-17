import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { CamfilAccountQuoteDetailPageComponent } from './camfil-account-quote-detail-page.component';

describe('Camfil Account Quote Detail Page Component', () => {
  let component: CamfilAccountQuoteDetailPageComponent;
  let fixture: ComponentFixture<CamfilAccountQuoteDetailPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilAccountQuoteDetailPageComponent],
      imports: [NgbModalModule, RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilAccountQuoteDetailPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

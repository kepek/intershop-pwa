import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';

import { CamfilSmallCtaModalComponent } from './camfil-small-cta-modal.component';

describe('Camfil Small Cta Modal Component', () => {
  let component: CamfilSmallCtaModalComponent;
  let fixture: ComponentFixture<CamfilSmallCtaModalComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilSmallCtaModalComponent, MockComponent(ContentIncludeComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilSmallCtaModalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

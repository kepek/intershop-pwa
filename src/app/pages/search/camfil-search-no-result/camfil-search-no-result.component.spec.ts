import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';

import { CamfilSearchNoResultComponent } from './camfil-search-no-result.component';

describe('Camfil Search No Result Component', () => {
  let component: CamfilSearchNoResultComponent;
  let fixture: ComponentFixture<CamfilSearchNoResultComponent>;
  let element: HTMLElement;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [CamfilSearchNoResultComponent, MockComponent(ContentIncludeComponent)],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilSearchNoResultComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render no result message with search term on template', () => {
    component.searchTerm = 'Test Search Term';
    translate.set('search.noResult.message', '{{0}}');
    fixture.detectChanges();
    expect(element.querySelector('.no-search-result-title')).toBeTruthy();
    expect(element.querySelector('.no-search-result-title').textContent).toContain(component.searchTerm);
  });
});

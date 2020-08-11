import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { SafeHtmlPipe } from 'ish-core/pipes/safe-html.pipe';
import { CamfilSearchBoxComponent } from 'ish-shell/header/camfil-search-box/camfil-search-box.component';

import { ErrorComponent } from './error.component';

describe('Error Component', () => {
  let fixture: ComponentFixture<ErrorComponent>;
  let element: HTMLElement;
  let component: ErrorComponent;
  let translate: TranslateService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ErrorComponent, MockComponent(CamfilSearchBoxComponent), SafeHtmlPipe],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorComponent);
    element = fixture.nativeElement;
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en_US');
    translate.use('en_US');
    translate.set('error.page.text', '<h3>test paragraph title</h3>');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render localized error text with HTML on template', () => {
    fixture.detectChanges();
    expect(element.getElementsByTagName('h3')[0].textContent).toContain('test paragraph title');
  });
});

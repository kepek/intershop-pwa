import { APP_BASE_HREF } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AppFacade } from 'ish-core/facades/app.facade';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { CamfilSearchBoxComponent } from 'ish-shell/header/camfil-search-box/camfil-search-box.component';

import { CamfilErrorComponent } from './camfil-error.component';

describe('Camfil Error Component', () => {
  let fixture: ComponentFixture<CamfilErrorComponent>;
  let element: HTMLElement;
  let component: CamfilErrorComponent;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        CamfilErrorComponent,
        MockComponent(CamfilSearchBoxComponent),
        MockComponent(ContentIncludeComponent),
        ServerHtmlDirective,
      ],
      providers: [
        { provide: AppFacade, useFactory: () => instance(mock(AppFacade)) },
        { provide: APP_BASE_HREF, useValue: '/' },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilErrorComponent);
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

  xit('should render search box on template', () => {
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toEqual(['camfil-search-box']);
  });
});

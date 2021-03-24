import { APP_BASE_HREF } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AppFacade } from 'ish-core/facades/app.facade';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { CamfilServerErrorComponent } from './camfil-server-error.component';

describe('Camfil Server Error Component', () => {
  let fixture: ComponentFixture<CamfilServerErrorComponent>;
  let element: HTMLElement;
  let component: CamfilServerErrorComponent;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [CamfilServerErrorComponent, ServerHtmlDirective],
      providers: [
        { provide: AppFacade, useFactory: () => instance(mock(AppFacade)) },
        { provide: APP_BASE_HREF, useValue: '/' },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilServerErrorComponent);
    element = fixture.nativeElement;
    component = fixture.componentInstance;
    component.error = makeHttpError({ status: 0 });
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en_US');
    translate.use('en_US');
    translate.set('servererror.page.text', '<h3>test paragraph title</h3>');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render error text includes HTML on template', () => {
    fixture.detectChanges();
    expect(element.getElementsByTagName('h3')[0].textContent).toContain('test paragraph title');
  });

  it('should render the error type if it is available', () => {
    component.error = makeHttpError({ status: 500 });
    component.type = 'Error';
    fixture.detectChanges();
    const a = element.querySelector('p.text-muted');
    expect(a).toBeTruthy();
    expect(a.textContent).toContain('Error');
  });

  it('should render a server timeout error content on template', () => {
    component.error = makeHttpError({ status: 0 });
    component.type = 'Error';
    fixture.detectChanges();
    expect(element.querySelector('p.text-muted').textContent).toContain('Server timeout');
  });

  it('should render a 5xx error content on template', () => {
    component.error = makeHttpError({ status: 500 });
    component.type = 'Error';
    fixture.detectChanges();
    expect(element.querySelector('p.text-muted').textContent).toContain('Error code 500');
  });
});

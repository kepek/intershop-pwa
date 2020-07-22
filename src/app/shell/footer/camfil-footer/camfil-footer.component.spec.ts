import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';

import { CamfilFooterComponent } from './camfil-footer.component';

describe('Camfil Footer Component', () => {
  let fixture: ComponentFixture<CamfilFooterComponent>;
  let element: HTMLElement;
  let component: CamfilFooterComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserTransferStateModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [CamfilFooterComponent, MockComponent(FaIconComponent), MockDirective(ServerHtmlDirective)],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CamfilFooterComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

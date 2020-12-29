import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockDirective } from 'ng-mocks';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { createContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { CamfilCmsCookieDisclaimerComponent } from './camfil-cms-cookie-disclaimer.component';

describe('Camfil Cms Cookie Disclaimer Component', () => {
  let component: CamfilCmsCookieDisclaimerComponent;
  let fixture: ComponentFixture<CamfilCmsCookieDisclaimerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [CamfilCmsCookieDisclaimerComponent, MockDirective(ServerHtmlDirective)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilCmsCookieDisclaimerComponent);
    component = fixture.componentInstance;
    const pagelet = {
      definitionQualifiedName: 'fq',
      id: 'id',
      displayName: 'name',
      domain: 'domain',
      configurationParameters: {
        Image: 'http://example.net/foo/bar.png',
      },
    };
    component.pagelet = createContentPageletView(pagelet);
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

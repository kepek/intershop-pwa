import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockDirective } from 'ng-mocks';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { createContentPageletView } from 'ish-core/models/content-view/content-view.model';

import { CamfilCMSSmallImageTextLinkComponent } from './camfil-cms-small-image-text-link.component';

describe('Camfil Cms Small Image Text Link Component', () => {
  let component: CamfilCMSSmallImageTextLinkComponent;
  let fixture: ComponentFixture<CamfilCMSSmallImageTextLinkComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [CamfilCMSSmallImageTextLinkComponent, MockDirective(ServerHtmlDirective)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilCMSSmallImageTextLinkComponent);
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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockDirective } from 'ng-mocks';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { createContentPageletView } from 'ish-core/models/content-view/content-view.model';

import { CamfilCMSImageTextButtonComponent } from './camfil-cms-image-text-button.component';

describe('Camfil Cms Image Text Button Component', () => {
  let component: CamfilCMSImageTextButtonComponent;
  let fixture: ComponentFixture<CamfilCMSImageTextButtonComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [CamfilCMSImageTextButtonComponent, MockDirective(ServerHtmlDirective)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilCMSImageTextButtonComponent);
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

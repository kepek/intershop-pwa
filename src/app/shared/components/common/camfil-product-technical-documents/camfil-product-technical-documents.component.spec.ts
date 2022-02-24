import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CamfilConfigurationFacade } from 'camfil-pwa/facades/camfil-configuration.facade';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ContentViewcontextComponent } from 'ish-shared/cms/components/content-viewcontext/content-viewcontext.component';

import { CamfilProductTechnicalDocumentsComponent } from './camfil-product-technical-documents.component';

describe('Camfil Product Technical Documents Component', () => {
  let component: CamfilProductTechnicalDocumentsComponent;
  let fixture: ComponentFixture<CamfilProductTechnicalDocumentsComponent>;
  let element: HTMLElement;
  let camfilConfigurationFacade: CamfilConfigurationFacade;

  beforeEach(async () => {
    camfilConfigurationFacade = mock(CamfilConfigurationFacade);

    await TestBed.configureTestingModule({
      declarations: [CamfilProductTechnicalDocumentsComponent, MockComponent(ContentViewcontextComponent)],
      providers: [{ provide: CamfilConfigurationFacade, useFactory: () => instance(camfilConfigurationFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilProductTechnicalDocumentsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(camfilConfigurationFacade.isEnabled$('showAllDocsType')).thenReturn(of(false));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});

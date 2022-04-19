import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CamfilConfigurationFacade } from 'camfil-pwa/facades/camfil-configuration.facade';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ContentViewcontextComponent } from 'ish-shared/cms/components/content-viewcontext/content-viewcontext.component';

import { CamfilProductTechnicalDocumentsComponent } from './camfil-product-technical-documents.component';

describe('Camfil Product Technical Documents Component', () => {
  let component: CamfilProductTechnicalDocumentsComponent;
  let fixture: ComponentFixture<CamfilProductTechnicalDocumentsComponent>;
  let element: HTMLElement;
  let camfilConfigurationFacade: CamfilConfigurationFacade;
  let appFacade: AppFacade;

  beforeEach(async () => {
    camfilConfigurationFacade = mock(CamfilConfigurationFacade);
    appFacade = mock(AppFacade);

    await TestBed.configureTestingModule({
      declarations: [CamfilProductTechnicalDocumentsComponent, MockComponent(ContentViewcontextComponent)],
      providers: [
        { provide: CamfilConfigurationFacade, useFactory: () => instance(camfilConfigurationFacade) },
        { provide: AppFacade, useFactory: () => instance(appFacade) },
      ],
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

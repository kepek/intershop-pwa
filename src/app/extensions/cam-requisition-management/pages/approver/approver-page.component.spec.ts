import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CamfilMyPageHeaderComponent } from 'ish-shared/components/camfil-my-page-header/camfil-my-page-header.component';
import { CamfilErrorMessageComponent } from 'ish-shared/components/common/camfil-error-message/camfil-error-message.component';
import { CamfilLoadingComponent } from 'ish-shared/components/common/camfil-loading/camfil-loading.component';

import { CamfilRequisitionsListComponent } from '../../components/camfil-requisitions-list/camfil-requisitions-list.component';
import { CamfilRequisitionContextFacade } from '../../facades/cam-requisition-context.facade';
import { CamRequisitionManagementFacade } from '../../facades/cam-requisition-management.facade';

import { ApproverPageComponent } from './approver-page.component';

describe('Approver Page Component', () => {
  let component: ApproverPageComponent;
  let fixture: ComponentFixture<ApproverPageComponent>;
  let element: HTMLElement;
  let reqFacade: CamRequisitionManagementFacade;
  let contextFacade: CamfilRequisitionContextFacade;
  let appFacade: AppFacade;

  beforeEach(async () => {
    reqFacade = mock(CamRequisitionManagementFacade);
    appFacade = mock(AppFacade);
    contextFacade = mock(CamfilRequisitionContextFacade);

    await TestBed.configureTestingModule({
      imports: [NgbNavModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        ApproverPageComponent,
        MockComponent(CamfilErrorMessageComponent),
        MockComponent(CamfilLoadingComponent),
        MockComponent(CamfilMyPageHeaderComponent),
        MockComponent(CamfilRequisitionsListComponent),
      ],
      providers: [
        { provide: CamRequisitionManagementFacade, useFactory: () => instance(reqFacade) },
        { provide: AppFacade, useFactory: () => instance(appFacade) },
      ],
    })
      .overrideComponent(ApproverPageComponent, {
        set: { providers: [{ provide: CamfilRequisitionContextFacade, useFactory: () => instance(contextFacade) }] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproverPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(reqFacade.requisitionsStatus$).thenReturn(of('PENDING'));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display loading overlay if requisitions are loading', () => {
    when(reqFacade.requisitionsLoading$).thenReturn(of(true));
    fixture.detectChanges();
    expect(element.querySelector('camfil-loading')).toBeTruthy();
  });
});

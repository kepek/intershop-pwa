import { CdkTableModule } from '@angular/cdk/table';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { PricePipe } from 'ish-core/models/price/price.pipe';
import { DatePipe } from 'ish-core/pipes/date.pipe';

import { CamRequisitionManagementFacade } from '../../facades/cam-requisition-management.facade';
import { CamfilRequisitionRejectDialogComponent } from '../camfil-requisition-reject-dialog/camfil-requisition-reject-dialog.component';

import { CamfilRequisitionsListComponent } from './camfil-requisitions-list.component';

describe('Camfil Requisitions List Component', () => {
  let component: CamfilRequisitionsListComponent;
  let fixture: ComponentFixture<CamfilRequisitionsListComponent>;
  let element: HTMLElement;
  let translate: TranslateService;
  let camRequisitionManagementFacade: CamRequisitionManagementFacade;

  beforeEach(async () => {
    camRequisitionManagementFacade = mock(CamRequisitionManagementFacade);
    await TestBed.configureTestingModule({
      imports: [CdkTableModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        CamfilRequisitionsListComponent,
        MockComponent(CamfilRequisitionRejectDialogComponent),
        MockPipe(DatePipe),
        MockPipe(PricePipe),
      ],
      providers: [
        { provide: CamRequisitionManagementFacade, useFactory: () => instance(camRequisitionManagementFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilRequisitionsListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
    translate.setTranslation('en', {
      'account.approvallist.items': { other: '# items' },
    });
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display no table columns if nothing is configured', () => {
    component.columnsToDisplay = [];
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=th-requisition-no]')).toBeFalsy();
    expect(element.querySelector('[data-testing-id=th-creation-date]')).toBeFalsy();
    expect(element.querySelector('[data-testing-id=th-approver]')).toBeFalsy();
    expect(element.querySelector('[data-testing-id=th-buyer]')).toBeFalsy();
    expect(element.querySelector('[data-testing-id=th-approval-date]')).toBeFalsy();
    expect(element.querySelector('[data-testing-id=th-rejection-date]')).toBeFalsy();
    expect(element.querySelector('[data-testing-id=th-line-items]')).toBeFalsy();
    expect(element.querySelector('[data-testing-id=th-order-total]')).toBeFalsy();
  });

  it('should display table columns if they are configured', () => {
    component.columnsToDisplay = [
      'customerNumberAndName',
      'orderGoodsMark',
      'creationDate',
      'buyer',
      'status',
      'orderChannel',
    ];
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=th-creation-date]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=th-buyer]')).toBeTruthy();
  });
});

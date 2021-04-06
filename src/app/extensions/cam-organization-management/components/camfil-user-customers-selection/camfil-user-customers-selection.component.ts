// tslint:disable: ish-ordered-imports project-structure ban-specific-imports
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { whenTruthy } from 'ish-core/utils/operators';

import { CamfilB2bUser } from '../../models/camfil-b2b-user/camfil-b2b-user.model';

import { CamfilConfirmationModalComponent } from './camfil-confirmation-moda/camfil-confirmation-modal.component';
import { CamfilUserCustomerSelectionFormItemComponent } from './camfil-user-customer-selection-form-item/camfil-user-customer-selection-form-item.component';
import { CamfilB2bCustomer } from '../../models/camfil-b2b-customer/camfil-b2b-customer.model';

@Component({
  selector: 'camfil-user-customers-selection',
  templateUrl: './camfil-user-customers-selection.component.html',
  styleUrls: ['./camfil-user-customers-selection.component.scss'],
})
export class CamfilUserCustomersSelectionComponent implements OnInit, OnDestroy {
  @Input() selectedUser: CamfilB2bUser;

  @ViewChild(CamfilConfirmationModalComponent) modal: CamfilConfirmationModalComponent;
  customers$: Observable<CamfilB2bCustomer[]>;
  customers: CamfilB2bCustomer[];
  parentCustomersForm: FormGroup;
  formError: boolean;
  customerCheckboxes: Array<{ id: string; companyName: string; checked: boolean }>;
  showPreview = true;
  previewSize = 1;
  private destroy$ = new Subject();

  get customerArray(): FormArray {
    return this.parentCustomersForm?.get('customers') as FormArray;
  }

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.customers$?.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(customers => {
      this.customers = customers;
      this.customerCheckboxes = this.initCheckboxes(customers);
      this.initParentCustomerForm();
      this.customerCheckboxes.forEach(c => {
        this.addCustomerItem(c);
      });
    });
  }

  initParentCustomerForm() {
    this.parentCustomersForm = new FormGroup({
      customers: new FormArray([]),
    });
  }

  addCustomerItem(customerCheckbox) {
    this.customerArray?.push(CamfilUserCustomerSelectionFormItemComponent.createCustomerItem(customerCheckbox));
  }

  submitForm() {
    const hasErrors = this.parentCustomersForm.value.customers.filter(form => form.customer && !form.contact);

    if (hasErrors && hasErrors.length) {
      this.formError = true;
    } else {
      this.formError = false;
      this.openModal();
    }
  }

  initCheckboxes(customers: CamfilB2bCustomer[]) {
    return customers.map(customer => ({
      id: customer.customerNo,
      value: customer.customerNo,
      companyName: customer.companyName,
      checked: false, // this.selectedUser?.customerNo?.includes(customer.customerNo),
    }));
  }

  openModal() {
    this.dialog.open(this.modal.show());
    this.modal.hide = () => this.dialog.closeAll();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  displayShowMoreLink() {
    return this.showPreview && this.isMaxTableLength();
  }

  isMaxTableLength() {
    return true;
  }

  showAllCustomers() {
    this.showPreview = false;
    this.previewSize = Number.MAX_VALUE;
  }

  collapseCustomersList() {
    this.showPreview = true;
    this.previewSize = 1;
  }
}

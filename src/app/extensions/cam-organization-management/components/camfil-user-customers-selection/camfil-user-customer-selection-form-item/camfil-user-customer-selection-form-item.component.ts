import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Subject } from 'rxjs';

import { CamfilB2bUser } from '../../../models/camfil-b2b-user/camfil-b2b-user.model';

@Component({
  selector: 'camfil-user-customer-selection-form-item',
  templateUrl: './camfil-user-customer-selection-form-item.component.html',
  styleUrls: ['./camfil-user-customer-selection-form-item.component.scss'],
})
export class CamfilUserCustomerSelectionFormItemComponent implements OnInit, OnDestroy {
  @Input() customerCheckbox: { id: string; value: string; companyName: string; checked: boolean };
  @Input() selectedUser: CamfilB2bUser;
  @Input() customerItemForm: FormGroup;

  contacts: Array<{ id: string; name: string }>;

  private destroy$ = new Subject<void>();

  get customerField(): FormControl {
    return this.customerItemForm?.get('customer') as FormControl;
  }
  get contactField(): FormControl {
    return this.customerItemForm?.get('contact') as FormControl;
  }

  constructor() {}

  static createCustomerItem(customerCheckbox): FormGroup {
    return new FormGroup({
      customer: new FormControl(customerCheckbox.checked),
      contact: new FormControl(''),
    });
  }

  ngOnInit() {
    this.contacts = [
      { id: 'contact1', name: 'Test Testsson' },
      { id: 'contact2', name: 'Test Testowski' },
      { id: 'contact3', name: 'Test Testicello' },
    ];
    // TODO: get contacts for current customer from store
    // this.camCardsFacade.loadContactsByCustomer(this.customerCheckbox.id);
    // this.camCardsFacade
    //   .contactsByCustomer$(this.customerCheckbox.id)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((contacts: CamCardContact[]) => console.log('testContacts', contacts));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeCheckbox(change: MatCheckboxChange) {
    this.customerCheckbox.checked = change.checked;
  }
}

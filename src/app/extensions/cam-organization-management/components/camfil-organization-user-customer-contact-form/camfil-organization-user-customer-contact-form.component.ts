import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSelectChange } from '@angular/material/select';

import { CamfilB2bContact } from '../../models/camfil-b2b-contact/camfil-b2b-contact.model';
import { CamfilB2bCustomer } from '../../models/camfil-b2b-customer/camfil-b2b-customer.model';
import { CamfilB2bUser } from '../../models/camfil-b2b-user/camfil-b2b-user.model';

@Component({
  selector: 'camfil-organization-user-customer-contact-form',
  templateUrl: './camfil-organization-user-customer-contact-form.component.html',
  styleUrls: ['./camfil-organization-user-customer-contact-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class CamfilOrganizationUserCustomerContactFormComponent implements OnInit, OnChanges {
  @Input() set customer(customer: CamfilB2bCustomer) {
    this.customerValue = customer;
  }

  get customer() {
    return this.customerValue;
  }

  private customerValue: CamfilB2bCustomer;

  @Input() set user(user: CamfilB2bUser) {
    this.userValue = user;
  }

  get user() {
    return this.userValue;
  }

  private userValue: CamfilB2bUser;

  @Input() set staticCustomers(staticCustomers: CamfilB2bCustomer[]) {
    this.staticCustomersValue = staticCustomers;
  }

  get staticCustomers() {
    return this.staticCustomersValue;
  }

  private staticCustomersValue: CamfilB2bCustomer[];

  @Output() connectUserWithCustomer = new EventEmitter<{
    customer: CamfilB2bCustomer;
    user: CamfilB2bUser;
  }>();

  @Output() disconnectUserFromCustomer = new EventEmitter<{
    customer: CamfilB2bCustomer;
    user: CamfilB2bUser;
  }>();

  @Output() connectContactWithUserAndCustomer = new EventEmitter<{
    customer: CamfilB2bCustomer;
    user: CamfilB2bUser;
    contact: CamfilB2bContact;
  }>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  get userCustomers() {
    return this?.user?.customers;
  }

  get userCustomer() {
    return this.userCustomers?.find(c => c.id === this.customer?.id);
  }

  get userCustomerContacts() {
    return this.userCustomer?.contacts || this.customer.contacts;
  }

  get userCustomerSelectedContact() {
    return this.userCustomer?.userContact;
  }

  get hasUserCustomer() {
    return !!this.userCustomer;
  }

  get hasUserCustomerSelectedContact() {
    return !!this.userCustomerSelectedContact;
  }

  // Methods

  private initForm() {
    this.form = this.fb.group({
      customerContactCheckbox: new FormControl({
        value: false,
        disabled: false,
      }),
      customerContactSelect: new FormControl({
        value: undefined,
        disabled: false,
        validators: [Validators.required],
      }),
    });

    const checkboxControl = this.form.get('customerContactCheckbox');
    const selectControl = this.form.get('customerContactSelect');

    if (this.hasUserCustomer) {
      checkboxControl.setValue(true);
      selectControl.enable();
    } else {
      checkboxControl.setValue(false);
      selectControl.disable();
    }
  }

  private updateForm() {
    if (!(this.form instanceof FormGroup)) {
      return;
    }

    const checkboxControl = this.form.get('customerContactCheckbox');
    const selectControl = this.form.get('customerContactSelect');

    selectControl.setValue(this.userCustomerSelectedContact?.erpId);

    if (this.isDisabledCustomer(this.customer)) {
      checkboxControl.disable();
    }
  }

  isDisabledCustomer(customer: CamfilB2bCustomer) {
    return this.staticCustomers?.map(c => c.id)?.includes(customer.id);
  }

  // Handlers

  onCheckboxChange(event: MatCheckboxChange) {
    const value = {
      customer: this.customer,
      user: this.user,
    };

    const checkboxControl = this.form.get('customerContactCheckbox');
    const selectControl = this.form.get('customerContactSelect');

    if (event.checked) {
      checkboxControl.setValue(true);

      selectControl.enable();
      selectControl.setErrors({ required: true });
      selectControl.markAsTouched();
    } else {
      this.disconnectUserFromCustomer.emit(value);
      selectControl.disable();
      selectControl.setValue('');
    }
  }

  onSelectChange(event: MatSelectChange) {
    const contact = this.userCustomerContacts?.find(c => c.erpId === event?.value);

    const value = {
      customer: this.customer,
      user: this.user,
      contact,
    };

    if (event.value) {
      this.connectContactWithUserAndCustomer.emit(value);
    } else {
      this.disconnectUserFromCustomer.emit(value);
    }
  }

  // Hooks

  ngOnInit() {
    this.initForm();
    this.updateForm();
  }

  ngOnChanges() {
    this.updateForm();
  }
}

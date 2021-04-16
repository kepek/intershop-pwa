import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CamfilB2bContact } from '../../models/camfil-b2b-contact/camfil-b2b-contact.model';
import { CamfilB2bCustomer } from '../../models/camfil-b2b-customer/camfil-b2b-customer.model';
import { CamfilB2bUser } from '../../models/camfil-b2b-user/camfil-b2b-user.model';

@Component({
  selector: 'camfil-organization-user-customer-contact-form',
  templateUrl: './camfil-organization-user-customer-contact-form.component.html',
  styleUrls: ['./camfil-organization-user-customer-contact-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
// tslint:disable-next-line:component-creation-test
export class CamfilOrganizationUserCustomerContactFormComponent implements OnInit, OnDestroy {
  @Input() contacts: CamfilB2bContact[];
  @Input() selectedContact: CamfilB2bContact;
  @Input() customer: CamfilB2bCustomer;
  @Input() user: CamfilB2bUser;

  @Output() assignCustomerUserContact = new EventEmitter<{
    customer: CamfilB2bCustomer;
    user: CamfilB2bUser;
    contact: CamfilB2bContact;
  }>();

  @Output() unassignCustomerUserContact = new EventEmitter<{
    customer: CamfilB2bCustomer;
    user: CamfilB2bUser;
    contact: CamfilB2bContact;
  }>();

  form: FormGroup;

  private destroy$ = new Subject();

  constructor(private fb: FormBuilder) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // tslint:disable-next-line:lifecycle-cyclomatic-complexity
  ngOnInit() {
    this.form = this.fb.group({
      customerContactCheckbox: new FormControl({
        value: false,
        disabled: false,
      }),
      customerContactSelect: new FormControl({
        value: undefined,
        disabled: true,
        validators: [Validators.required],
      }),
    });

    const checkboxControl = this.form.get('customerContactCheckbox');
    const selectControl = this.form.get('customerContactSelect');

    checkboxControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      selectControl?.[value ? 'enable' : 'disable']();

      if (!value) {
        selectControl.reset();
        this.onCustomerUserContactChange({ value });
      }
    });

    if (this.selectedContact?.erpId) {
      checkboxControl.setValue(true);
      selectControl.enable();
    } else {
      checkboxControl.setValue(false);
      selectControl.disable();
    }

    if (this.customer?.parent) {
      checkboxControl.setValue(true);
      checkboxControl.disable();
      selectControl.enable();
    }

    selectControl.setValue(this.selectedContact?.erpId);
  }

  get isSelected() {
    return !this.form?.get('customerContactCheckbox')?.value && !!this.form?.get('customerContactSelect')?.value;
  }

  onCustomerUserContactChange(event) {
    const { contacts, customer, user } = this;

    if (!contacts.length) {
      return;
    }

    const contactId = event?.value;
    const contact = this.contacts.find(c => c.erpId === contactId);

    if (contact) {
      this.assignCustomerUserContact.emit({
        customer,
        user,
        contact,
      });
    } else if (this.selectedContact) {
      this.unassignCustomerUserContact.emit({
        customer,
        user,
        contact: this.selectedContact,
      });
    }
  }
}

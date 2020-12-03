import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CamfilB2bContact } from '../../models/camfil-b2b-contact/camfil-b2b-contact.model';
import { CamfilB2bCustomer } from '../../models/camfil-b2b-customer/camfil-b2b-customer.model';
import { CamfilB2bUser } from '../../models/camfil-b2b-user/camfil-b2b-user.model';

@Component({
  selector: 'camfil-organization-customer-user-contact-form',
  templateUrl: './camfil-organization-customer-user-contact-form.component.html',
  styleUrls: ['./camfil-organization-customer-user-contact-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
// tslint:disable-next-line:component-creation-test
export class CamfilOrganizationCustomerUserContactFormComponent implements OnInit, OnDestroy {
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

  ngOnInit() {
    this.form = this.fb.group({
      canSelectCustomerContact: new FormControl({
        value: !!this.selectedContact,
        disabled: this.contacts?.length === 0,
      }),
      customerContact: new FormControl({ value: this.selectedContact?.erpId, disabled: !this.selectedContact }, [
        Validators.required,
      ]),
    });

    const canSelectCustomerContact = this.form.get('canSelectCustomerContact');
    const customerContact = this.form.get('customerContact');

    canSelectCustomerContact.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      customerContact?.[value ? 'enable' : 'disable']();

      if (!value) {
        customerContact.reset();
        this.onCustomerUserContactChange({ value });
      }
    });
  }

  get canSelectCustomerContact() {
    return this.form.get('canSelectCustomerContact').value;
  }

  get customerContact() {
    return this.form.get('customerContact').value;
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
    } else {
      this.unassignCustomerUserContact.emit({
        customer,
        user,
        contact: this.selectedContact,
      });
    }
  }
}

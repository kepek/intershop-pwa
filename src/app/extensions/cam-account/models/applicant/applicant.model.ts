import { Captcha } from 'ish-core/models/captcha/captcha.model';

export interface Applicant extends Captcha {
  title?: string;
  firstName: string;
  lastName: string;
  email: string;
  customerName: string;
  customerNo?: string;
  comment?: string;
}

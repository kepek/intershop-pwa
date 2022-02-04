import { Captcha } from 'ish-core/models/captcha/captcha.model';

export interface CamfilApplicantReminder extends Captcha {
  email: string;
  answer?: string;
}

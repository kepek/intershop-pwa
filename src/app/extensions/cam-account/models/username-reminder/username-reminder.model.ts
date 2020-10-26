import { Captcha } from 'ish-core/models/captcha/captcha.model';

export interface UsernameReminder extends Captcha {
  email: string;
  answer?: string;
}

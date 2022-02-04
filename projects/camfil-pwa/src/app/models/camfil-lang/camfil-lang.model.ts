export interface CamfilLangPayload {
  lang: string;
}

export interface CamfilLangSubject extends CamfilLangPayload {
  customerId: string;
  userId: string;
}

export interface CamfilLangData {
  languageCode: string;
}

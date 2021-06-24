export interface LangPayload {
  lang: string;
}

export interface LangSubject extends LangPayload {
  customerId: string;
  userId: string;
}

export interface LangData {
  languageCode: string;
}

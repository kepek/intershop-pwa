export interface CamfilErrorValidator {
  error: string;
  message: string;
  ifNot?: string;
  messageVariables?: string[];
}

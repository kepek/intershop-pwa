export interface ZipCodeInfo {
  id?: string;
  city: string;
  country?: string;
  zipCode: string;
}

export interface ZipCodeData {
  cityAlias: string;
  cityId: string;
  countryRegionId: string;
  countyId: string;
  districtId: string;
  language: string;
  stateId: string;
  street: string;
  streetNumberMaximum: number;
  streetNumberMinimum: number;
  streetNumberValidity: string;
  timeZone: string;
  zipCode: string;
}

import { Auth0Config } from 'ish-core/identity-provider/auth0.identity-provider';
import { ChannelConfiguration } from 'ish-core/models/channel-configuration/channel-configuration.model';
import { CookieConsentOptions } from 'ish-core/models/cookies/cookies.model';
import { Locale } from 'ish-core/models/locale/locale.model';
import { DeviceType, ViewType } from 'ish-core/models/viewtype/viewtype.types';

import { TactonConfig } from '../app/extensions/tacton/models/tacton-config/tacton-config.model';

export interface Environment {
  production: boolean;

  /* INTERSHOP COMMERCE MANAGEMENT REST API CONFIGURATION */

  icmBaseURL: string;
  icmServer: string;
  icmServerStatic: string;

  // temporarily hard-coded identity provider ID, later supplied by configurations call
  identityProvider: 'ICM' | string;

  // application specific
  icmChannel: string;
  icmApplication?: string;

  /* INTERSHOP PROXY CONFIGURATION */
  icmProxyURL?: string;

  // array of REST path expressions that should always be mocked
  apiMockPaths?: string[];

  /* FEATURE TOOGLES */
  features: (
    | 'compare'
    | 'rating'
    | 'recently'
    /* B2B features */
    | 'advancedVariationHandling'
    | 'businessCustomerRegistration'
    | 'quoting'
    | 'quickorder'
    | 'orderTemplates'
    /* Third-party Integrations */
    | 'sentry'
    | 'tracking'
    | 'tacton'
    /* B2C features */
    | 'wishlists'
    /* Camfil features */
    | 'camOrganizationManagement'
    | 'camConfiguration'
    | 'camIcc'
    | 'camAccount'
    | 'camCards'
    | 'camDemo'
    | 'camAhu'
  )[];

  /* ADDITIONAL FEATURE CONFIGURATIONS */

  // track shop interaction via Google Tag Manager (to be used with 'tracking' feature, works with server side rendering only)
  gtmToken?: string;

  // log client-side javascript errors to sentry.io (to be used with 'sentry' feature, works with server side rendering only)
  sentryDSN?: string;

  // tacton integration
  tacton?: TactonConfig;

  /* PROGRESSIVE WEB APP CONFIGURATIONS */

  // Bootstrap grid system breakpoint widths as defined in the variables-bootstrap-customized.scss for usage in Javascript logic
  smallBreakpointWidth: number;
  mediumBreakpointWidth: number;
  largeBreakpointWidth: number;
  extralargeBreakpointWidth: number;

  // global definition of the maximal depth of the main navigation sub categories
  mainNavigationMaxSubCategoriesDepth: number;

  // global definition of the product listing page size
  productListingItemsPerPage: number;

  // default viewType used for product listings
  defaultProductListingViewType: ViewType;

  // default device type used for initial page responses
  defaultDeviceType: DeviceType;

  // enable or disable service worker
  serviceWorker: boolean;

  // configuration of the available locales - hard coded for now
  locales: Locale[];

  // configuration of the styling theme ('default' if not configured)
  // format: 'themeName|themeColor' e.g. theme: 'blue|688dc3',
  theme?: string;

  // cookie consent options
  cookieConsentOptions?: CookieConsentOptions;
  cookieConsentVersion?: number;

  // client-side configuration for identity providers
  identityProviders?: {
    [name: string]:
      | {
          type: string;
          [key: string]: unknown;
        }
      | Auth0Config;
  };

  channelConfs?: ChannelConfiguration[];

  /* ICC API CONFIGURATION */

  iccProxyURL: string;
  iccToken: string;
  iccTokenHeaderKey: string;
  iccServer: string;
}

export const ENVIRONMENT_DEFAULTS: Environment = {
  /* INTERSHOP COMMERCE MANAGEMENT REST API CONFIGURATION */

  icmBaseURL: 'NOT SET',
  icmChannel: 'Camfil-CamfilFI-Site',
  icmServer: 'INTERSHOP/rest/WFS',
  icmServerStatic: 'INTERSHOP/static/WFS',
  icmApplication: 'rest',
  identityProvider: 'ICM',

  production: false,

  /* FEATURE TOOGLES */
  features: [
    'compare',
    'rating',
    'recently',
    /* B2B features */
    'advancedVariationHandling',
    'businessCustomerRegistration',
    /* Google Tag Manager */
    'tracking',
    /* Camfil features */
    'camIcc',
    'camAccount',
    'camOrganizationManagement',
    'camCards',
    'camAhu',
    'camDemo',
  ],

  /* PROGRESSIVE WEB APP CONFIGURATIONS */
  theme: 'camfil|00673E',
  serviceWorker: false,
  smallBreakpointWidth: 576,
  mediumBreakpointWidth: 768,
  largeBreakpointWidth: 1200,
  extralargeBreakpointWidth: 1480,
  mainNavigationMaxSubCategoriesDepth: 5,
  productListingItemsPerPage: 9,
  defaultProductListingViewType: 'simple',
  defaultDeviceType: 'mobile',
  locales: [
    { lang: 'fi_FI', currency: 'EUR', value: 'fi', displayName: 'Finnish', displayLong: 'Finnish (Finland)' },
    { lang: 'sv_SE', currency: 'SEK', value: 'se', displayName: 'Swedish', displayLong: 'Swedish (Sweden)' },
    {
      lang: 'en_GB',
      currency: 'GBP',
      value: 'gb',
      displayName: 'English',
      displayLong: 'English (Great Britain)',
    },
  ],
  cookieConsentOptions: {
    options: {
      required: {
        name: 'cookie.consent.option.required.name',
        description: 'cookie.consent.option.required.description',
        required: true,
      },
      functional: {
        name: 'cookie.consent.option.functional.name',
        description: 'cookie.consent.option.functional.description',
      },
      tracking: {
        name: 'cookie.consent.option.tracking.name',
        description: 'cookie.consent.option.tracking.description',
      },
    },
    allowedCookies: ['cookieConsent', 'apiToken'],
  },
  cookieConsentVersion: 1,

  /* ToDo: Config for testing. Replace with correct gtmContainerId/tokens when provided by Camfil */
  channelConfs: [
    { channel: 'Camfil-CamfilFI-Site', gtmContainerId: 'GTM-TSM3JN4' },
    { channel: 'Camfil-CamfilSE-Site', gtmContainerId: 'GTM-TSM3JN4' },
  ],
  /* ICC API CONFIGURATION */

  iccProxyURL: 'https://apim-icc.azure-api.net',
  iccToken: 'NOT SET',
  iccTokenHeaderKey: 'Ocp-Apim-Subscription-Key',
  iccServer: 'ICC',
};

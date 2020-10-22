require('ts-node').register({
  project: './tsconfig.base.json',
});

const getProxyEnvironmentConfig = () => {
  try {
    return require('./environments/environment.proxy').environment;
  } catch (err) {
    console.error('The proxy environment config file does not exist.');
    console.error(err);
    process.exit(1);
  }
};

const environment = getProxyEnvironmentConfig();

if (!environment.icmProxyURL) {
  console.error('Did not find a valid PROXY_ICM. Setup a environment.proxy.ts or supply it via environment variable.');
}

const getHttpAgent = endpoint => {
  const https = require('https');
  const http = require('http');
  const httpProtocol = new URL(endpoint).protocol.slice(0, -1);
  return httpProtocol === 'https' ? new https.Agent({ rejectUnauthorized: false }) : new http.Agent();
};

const PROXY_ICM = process.env.PROXY_ICM || environment.icmProxyURL;

const isUrl = PROXY_ICM && PROXY_ICM.startsWith('http');

const useProxy = isUrl;

if (PROXY_ICM && !isUrl) {
  console.error('PROXY_ICM is not url');
  process.exit(1);
}

module.exports = !useProxy
  ? {}
  : {
      '/INTERSHOP/*': {
        target: PROXY_ICM,
        secure: true,
        changeOrigin: true,
        logLevel: 'debug',
        agent: getHttpAgent(PROXY_ICM),
      },
    };

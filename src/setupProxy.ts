const getHttpAgent = endpoint => {
  const https = require('https');
  const http = require('http');
  const httpProtocol = new URL(endpoint).protocol.slice(0, -1);
  return httpProtocol === 'https' ? new https.Agent({ rejectUnauthorized: false }) : new http.Agent();
};

const PROXY_ICM = process.env.PROXY_ICM;

const TRUST_ICM = process.env.TRUST_ICM ? Boolean(Number(JSON.parse(process.env.TRUST_ICM))) : true;

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
        secure: TRUST_ICM,
        changeOrigin: true,
        logLevel: 'debug',
        agent: getHttpAgent(PROXY_ICM),
      },
    };

const PROXY_ICM = process.env.PROXY_ICM || 'https://intershoppwa.azurewebsites.net';

module.exports = {
  '/INTERSHOP': {
    target: PROXY_ICM,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
  },
};

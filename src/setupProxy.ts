const PROXY_ICM = process.env.PROXY_ICM || 'https://intershoppwa.azurewebsites.net';

export default {
  '/INTERSHOP': {
    target: PROXY_ICM,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: {
      '^/INTERSHOP': '',
    },
  },
};

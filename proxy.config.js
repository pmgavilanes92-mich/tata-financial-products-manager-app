const PROXY_CONFIG = [
  {
    context: ['/api', '/api/**'],
    target: 'http://localhost:3002',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: {
      '^/api': '',
    },
  },
];

module.exports = PROXY_CONFIG;

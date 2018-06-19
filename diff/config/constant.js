
const config = {
  publicPath: {
    prod: '/diff',
    dev: '',
  },
  title: {
    prod: 'template',
    dev: 'dev-template',
  },
  cdn: {
    dev: {
      modules: [
        {
          name: 'jquery',
          var: '$',
        },
        {
          name: 'bootstrap',
          style: 'dist/css/bootstrap.min.css',
          cssOnly: true,
          path: 'dist/js/bootstrap.min.js',
        },
      ],
      prod: false,
      publicPath: '/node_modules',
    },
    prod: {
      modules: [
        {
          name: 'jquery',
          var: '$',
          path: 'jquery.min.js',
        },
        {
          name: 'bootstrap',
          style: 'css/bootstrap.min.css',
          cssOnly: true,
          path: 'js/bootstrap.min.js',
        },
        {
          name: 'clipboard',
          var: 'Clipboard',
          path: 'clipboard.min.js',
          cdn: 'clipboard.js',
        },
      ],
      prod: true,
      prodUrl: '//cdn.bootcss.com/:name/:version/:path',
    },
  },
  provider: {
    jQuery: ['jquery'],
    _map: ['lodash', 'map'],
  },
};

module.exports = config;

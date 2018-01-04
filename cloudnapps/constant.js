
const config = {
  publicPath: {
    prod: '/cloudnapps',
    dev: '',
  },
  title: {
    prod: 'cloudnapps',
    dev: 'dev-cloudnapps',
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
        {
          name: 'blueimp-md5',
          var: 'md5',
          path: 'js/md5.min.js',
        },
      // json5 is beta version, no cdn
      // {
      //   name: 'json5',
      // }
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

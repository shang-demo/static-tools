'use strict';
var path = require('path');

/****** start: 用户配置***********/

var alterableSetting = { // prod 的 基础路径
  injectSource: {js: [], css: []},
  sourcePath: 'public/',
  basePath: 'production/',
  publicPath: 'production/public/',
  viewPath: 'production/views/'
};


function getCommonConfig() {
  return {
    clean: { // 清除生成文件的路径
      src: [
        alterableSetting.basePath + '**/*',
        '!' + alterableSetting.basePath + '/.git/',
        '!' + alterableSetting.basePath + '/CNAME',
        '!' + alterableSetting.basePath + '/Makefile'
      ]
    },
    sass: {
      watcherPath: [], // watch:sass 文件路径
      src: [],
      opt: {},
      subStr: '',
      newStr: '', // prod环境下 替换fonts后的路径
      dest: ''
    },
    less: {
      watcherPath: [], // watch:sass 文件路径
      src: [],
      opt: {},
      dest: 'app/public/css'
    },
    injectHtmlDev: { // development环境
      src: [],
      opt: {
        cwd: 'app/views',
        base: 'app/views'
      },
      cssSoruce: [ // 需要引入的css
      ],
      jsSource: [ // 需要引入的js, config.specJs会加载在其上面
      ],
      libJsPrefix: 'app/public/vendor', // libJS  依赖于 config.libJs.src; 需要加上前缀
      ignorePath: 'app/public/', // 路径去除, 相当于 base
      dest: 'app/views'
    },
    libCss: { // lib css 需要引入的的css
      src: [],
      opt: {
        cwd: 'app/public/'
      },
      dest: 'app/public/css'
    },
    libJs: { // lib js, 需要按照顺序书写
      'src': [],
      'opt': {
        'cwd': 'app/public/vendor',
        'base': 'app/public/vendor'
      },
      dest: path.join(alterableSetting.publicPath, 'js') // libJs在prod环境下才需要 输出, 故dest为 prod环境的dest
    },
    specJs: {
      src: [ // 需要引入的且没有依赖项的js,如i18n,  [可以为空数组]

      ]
    },
    js: { // 用户写的 js
      src: alterableSetting.injectSource.js,
      opt: {
        cwd: alterableSetting.sourcePath,
        base: alterableSetting.sourcePath
      },
      filters: [],
      dest: path.join(alterableSetting.publicPath, 'js') // userJs在prod环境下才需要 输出, 故dest为 prod环境的dest
    },
    images: {
      src: [
        '**/*+(.ico|.png|.jpg|.jpeg)'
      ],
      opt: {
        cwd: alterableSetting.sourcePath,
        base: alterableSetting.sourcePath
      },
      dest: alterableSetting.publicPath
    },
    fonts: {
      src: [path.join(alterableSetting.sourcePath, 'font/**/*')],
      dest: path.join(alterableSetting.publicPath, 'font')
    },
    injectHtmlProd: {
      src: 'index.html',
      opt: {
        cwd: alterableSetting.sourcePath,
        base: alterableSetting.sourcePath
      },
      cssSoruce: (function() {
        return alterableSetting.injectSource.css.map(function(item) {
          return path.join(alterableSetting.sourcePath, item);
        });
      }()),
      injectSource: [
        path.join(alterableSetting.publicPath, 'css/**/*.css'),
        path.join(alterableSetting.publicPath, 'js/user*.min*.js')
      ],
      transform: function (filepath, transform, args) {
        var reg = new RegExp('.*/(' + alterableSetting.sourcePath.replace(/\/$/, '') + '|static\\d+)' + '/')
        args[0] = filepath.replace(reg, '');
        return transform.apply(transform, args);
      },
      cssDest: path.join(alterableSetting.publicPath, 'css'),
      dest: alterableSetting.viewPath,
      injectIgnorePath: alterableSetting.publicPath,
      isHtmlmin: true,
      prodCssName: 'production', // css压缩后的名称(无需写 min.css)
      prodUserJsName: 'user', // 用户js压缩后的名字(无需写 min.js)
      prodLibJsName: 'lib' // lib js 压缩后的名字 (无需写 min.js)
    },
    html2js: {
      src: [],
      opt: {
        'cwd': 'app/public/',
        'base': 'app/'
      },
      config: {
        module: 'cloudMusic',
        transformUrl: function(url) {
          return url.replace(/.*\/(public)\//, '');
        }
      },
      isHtmlmin: true,
      name: 'template-app.js',
      dest: path.join(alterableSetting.publicPath, 'js')
    },
    server: {
      jsWatch: [],
      src: [],
      opt: {
        'cwd': 'app/',
        'base': 'app/'
      },
      dest: alterableSetting.basePath
    },
    revAll: {
      src: [
        '**/*',
        '!imagas/**/*',
        '!fonts/**/*',
        '!index.html'
      ],
      opt: {
        'cwd': alterableSetting.publicPath,
        'base': alterableSetting.publicPath
      },
      dest: alterableSetting.publicPath
    },
    browsersync: {
      development: {
        proxy: 'http://127.0.0.1:1337',
        port: 8888,
        files: [
          'app/public/**/*',
          'app/views/**/*'
        ]
      }
    },
    minifyCssConfig: { // 压缩css配置
      keepSpecialComments: 0
    },
    uglifyConfig: { // 压缩js配置
      compress: {
        drop_console: true
      }
    },
    htmlminConfig: {
      collapseWhitespace: true,
      removeComments: true
    },
    jshintPath: '', //'config/.jshintrc',                 // jshintrc 的路径, 相对gulpfile.js
    jshintPathApp: '' //'config/.jshintrc_app'                 // jshintrc 的路径, 相对gulpfile.js
  };
}

/****** end: 用户配置***********/


function getSpecConfig() {
  return {
    languageJsons: {
      src: [],
      opt: {
        cwd: 'app/public',
        base: 'app/public'
      },
      dest: alterableSetting.publicPath
    },
    theme: {
      src: [],
      opt: {
        cwd: 'app/public',
        base: 'app/public'
      },
      dest: alterableSetting.publicPath,
      storeFileNameSpaceName: 'nightTheme'
    }
  };
}

function getInjectSource() {
  var fs = require('fs');
  var data = fs.readFileSync(path.join(alterableSetting.sourcePath, 'index.html'), 'utf-8');
  var cssSource = [];
  var jsSource = [];


  var cssData = data.match(/\<!-- inject\:css --\>(.*[\r\n])*?\s*(?=\<!-- endinject --\>)/i);
  if (cssData && cssData[0]) {
    var arr = cssData[0].match(/href\s*\=\s*['"].*?\.css['"]/g);
    arr.forEach(function(item) {
      cssSource.push(item.replace(/href\s*\=\s*['"]/, '').replace(/['"]/, ''));
    });
  }


  var jsData = data.match(/\<!-- inject\:js --\>(.*[\r\n])*?\s*(?=\<!-- endinject --\>)/i);
  if (jsData && jsData[0]) {
    var arr = jsData[0].match(/src\s*\=\s*['"].*?\.js['"]/g);
    arr.forEach(function(item) {
      jsSource.push(item.replace(/src\s*\=\s*['"]/, '').replace(/['"]/, ''));
    });
  }

  console.log({
    js: jsSource,
    css: cssSource
  });

  return {
    js: jsSource,
    css: cssSource
  }
}

function setInjectSource() {
  alterableSetting.injectSource = getInjectSource();
}

module.exports = {
  setInjectSource: setInjectSource,
  alterableSetting: alterableSetting,
  getCommonConfig: getCommonConfig,
  getSpecConfig: getSpecConfig
};

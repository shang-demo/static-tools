'use strict';

var args = require('yargs').argv;
var gulp = require('gulp');
var path = require('path');
var browserSync = require('browser-sync').create();

var myJshintReporter = require('./myJshintReporter.js');

var gulpConfig = require('./config.js');
var specConfig = null;       // 在环境初始化之后再读取配置
var config = null;

var $ = require('gulp-load-plugins')(
  {
    pattern: ['gulp-*', 'del', 'streamqueue']
    //,lazy: false
  });
$.storeFileName = require('./storeFileName.js');
$.isBuild = false;
$.isStatic = false;
$.specConfig = specConfig;
$.config = config;

function getConfig() {
  config = gulpConfig.getCommonConfig();
  specConfig = gulpConfig.getSpecConfig();
  $.config = config;
  $.specConfig = specConfig;
}

function setDevEnv(done) {
  gulpConfig.alterableSetting.publicPath = 'app/public';
  getConfig();
  return done();
}

function changeSrc(src) {
  if(typeof src === 'string') {
    return path.join('**', src);
  }
  else {
    return src.map(function(value) {
      return path.join('**', value);
    });
  }
}

// global error handler
function errorHandler(error) {
  console.log(error);
  this.end();
}

function validConfig(config) {
  return config.src && config.src.length;
}


/**
 *
 * 特殊需求, 每个项目不同
 *
 */

gulp.task('languages', function(done) {
  if(!$.isBuild || !validConfig(specConfig.languageJsons)) {
    return done();
  }
  return gulp.src(specConfig.languageJsons.src, specConfig.languageJsons.opt)
    .pipe(gulp.dest(specConfig.languageJsons.dest));
});

gulp.task('theme', function(done) {
  if(!$.isBuild || !validConfig(specConfig.theme)) {
    return done();
  }
  return gulp.src(specConfig.theme.src, specConfig.theme.opt)
    .pipe($.cssnano())
    .pipe($.rev())
    .pipe($.rename({extname: '.min.css'}))
    .pipe($.storeFileName(specConfig.theme.storeFileNameSpaceName))
    .pipe(gulp.dest(specConfig.theme.dest));

});

gulp.task('userTask', gulp.series('theme', 'languages'));


/**
 * end: 特殊需求
 */


gulp.task('browser-sync', function(done) {
  browserSync.init(config.browsersync.development);
  return done();
});

// no-op = empty function
gulp.task('noop', function() {
});

gulp.task('clean', function(done) {
  return $.del(config.clean.src, done);
});

// 复制 lib css
gulp.task('libCss', function(done) {
  if(!validConfig(config.libCss)) {
    return done();
  }

  return gulp
    .src(config.libCss.src, config.libCss.opt)
    .pipe(gulp.dest(config.libCss.dest));
});

gulp.task('sass', function() {
  if(!validConfig(config.sass)) {
    return done();
  }
  return gulp.src(config.sass.src, config.sass.opt)
    .pipe($.if($.isBuild, $.replace(config.sass.subStr, config.sass.newStr)))
    .pipe($.sass())
    .on('error', $.sass.logError)
    .pipe(gulp.dest(config.sass.dest));
});

gulp.task('less', function(done) {
  if(!validConfig(config.less)) {
    return done();
  }
  return gulp
    .src(config.less.src, config.less.opt)
    .pipe($.less({
      expand: true,
      ext: '.css'
    }))
    .pipe(gulp.dest(config.less.dest));
});

gulp.task('injectHtml:dev', function(done) {

  var ignorePath = {
    ignorePath: config.injectHtmlDev.ignorePath
  };

  var arr = [{objectMode: true}];
  if(config.injectHtmlDev.cssSoruce && config.injectHtmlDev.cssSoruce.length) {
    var css = gulp.src(config.injectHtmlDev.cssSoruce, {read: false});
    arr.push(css);
  }
  if(validConfig(config.libJs) && config.injectHtmlDev.libJsPrefix) {
    var libJs = gulp.src(config.libJs.src.map(function(value) {
      return path.join(config.injectHtmlDev.libJsPrefix, value);
    }), {read: false});
    arr.push(libJs);
  }

  if(validConfig(config.specJs)) {
    var specJs = gulp.src(config.specJs.src, {read: false});
    arr.push(specJs);
  }

  if(config.injectHtmlDev.jsSource && config.injectHtmlDev.jsSource.length) {
    var userJs = gulp
      .src(config.injectHtmlDev.jsSource)
      .pipe($.angularFilesort())
      .on('error', errorHandler);

    arr.push(userJs);
  }

  if(arr.length <=1 || !validConfig(config.injectHtmlDev)) {
    return done();
  }

  return gulp
    .src(config.injectHtmlDev.src, config.injectHtmlDev.opt)
    .pipe($.inject(
      $.streamqueue.apply($.streamqueue, arr),
      ignorePath
    ))
    .on('error', errorHandler)
    .pipe(gulp.dest(config.injectHtmlDev.dest));
});

gulp.task('images', function(done) {
  if(!validConfig(config.images)) {
    return done();
  }
  return gulp
    .src(config.images.src, config.images.opt)
    .pipe(gulp.dest(config.images.dest))
});

gulp.task('fonts', function(done) {
  if(!validConfig(config.fonts)) {
    return done();
  }
  return gulp
    .src(config.fonts.src)
    .pipe(gulp.dest(config.fonts.dest))
});


gulp.task('css', function(done) {

  if(!config.injectHtmlProd.cssSoruce || !config.injectHtmlProd.cssSoruce.length || !config.injectHtmlProd.prodCssName) {
    return done();
  }

  return gulp.src(config.injectHtmlProd.cssSoruce)
    .pipe($.concat(config.injectHtmlProd.prodCssName))
    // .pipe($.cssnano())
    // .pipe($.rev())
    .pipe($.rename({extname: '.min.css'}))
    .pipe(gulp.dest(config.injectHtmlProd.cssDest));
});


// jshint 用户的js
gulp.task('js', function(done) {
  if(!validConfig(config.js)) {
    return done();
  }
  if(!$.isBuild) {
    return gulp.src(config.js.src, config.js.opt)
      .pipe($.if(config.jshintPath, $.jshint(config.jshintPath)))
      .pipe($.if(config.jshintPath, $.jshint.reporter(myJshintReporter)));
  }

  var jssStreamQueue = [{
    objectMode: true
  }];

  if(validConfig(config.specJs)) {
    var specStream = gulp.src(config.specJs.src);
    jssStreamQueue.push(specStream);
  }

  if(validConfig(config.js)) {
    var stream = gulp.src(config.js.src, config.js.opt);
    var filters = config.js.filters;
    var f;
    for(var i = 0, l = filters.length; i < l; i++) {
      if(!filters[i].src || !filters[i].src.length) {
        continue;
      }
      f = $.filter(changeSrc(filters[i].src), {restore: true});

      if(typeof filters[i].newStr === 'function') {
        filters[i].newStr = filters[i].newStr($);
      }
      
      stream = stream
        .pipe(f)
        .pipe($.replace(filters[i].subStr, filters[i].newStr))
        .pipe(f.restore);
    }

    var scriptStream = stream.pipe($.if(config.jshintPath, $.jshint(config.jshintPath)))
      .pipe($.if(config.jshintPath, $.jshint.reporter(myJshintReporter)))
      //.pipe($.ngAnnotate())
      //.pipe($.angularFilesort())
      .on('error', errorHandler);

    jssStreamQueue.push(scriptStream);
  }

  if(validConfig(config.html2js)) {
    var templateStream = gulp
      .src(config.html2js.src, config.html2js.opt)
      .pipe($.if(config.html2js.isHtmlmin, $.htmlmin(config.htmlminConfig)))
      .pipe($.angularTemplatecache(config.html2js.name, config.html2js.config));

    jssStreamQueue.push(templateStream);
  }

  return $.streamqueue.apply($.streamqueue, jssStreamQueue)
    .pipe($.concat(config.injectHtmlProd.prodUserJsName))
    .pipe($.uglify(config.uglifyConfig))
    .pipe($.rev())
    .pipe($.rename({extname: '.min.js'}))
    .on('error', errorHandler)
    .pipe(gulp.dest(config.js.dest));
});

gulp.task('libJs', function(done) {
  if(!validConfig(config.libJs) || !config.injectHtmlProd.prodLibJsName) {
    return done();
  }

  return gulp.src(config.libJs.src, config.libJs.opt)
    .pipe($.concat(config.injectHtmlProd.prodLibJsName))
    .pipe($.uglify(config.uglifyConfig))
    .pipe($.rev())
    .pipe($.rename({extname: '.min.js'}))
    .on('error', errorHandler)
    .pipe(gulp.dest(config.libJs.dest));
});

gulp.task('injectHtml:prod', function() {
  var injectSource = gulp.src(config.injectHtmlProd.injectSource, {read: false});
  return gulp
    .src(config.injectHtmlProd.src, config.injectHtmlProd.opt)
    .pipe($.inject(injectSource, {
      transform: function (filepath) {
        return config.injectHtmlProd.transform(filepath, $.inject.transform, arguments);
      }
    }))
    .pipe($.if(config.injectHtmlProd.isHtmlmin, $.htmlmin(config.htmlminConfig)))
    .pipe(gulp.dest(config.injectHtmlProd.dest));
});

gulp.task('server', function(done) {
  if($.isStatic || !validConfig(config.server)) {
    return done();
  }
  var f = $.filter(['**/*.js'], {restore: true});

  if(!$.isBuild) {
    return gulp
      .src(config.server.src, config.server.opt)
      .pipe(f)
      .pipe($.jshint(config.jshintPathApp))
      .pipe($.jshint.reporter(myJshintReporter))
      .pipe(f.restore);
  }

  return gulp
    .src(config.server.src, config.server.opt)
    .pipe(f)
    .pipe($.jshint(config.jshintPathApp))
    .pipe($.jshint.reporter(myJshintReporter))
    .pipe(f.restore)
    .pipe(gulp.dest(config.server.dest))
});

// start watchers
gulp.task('watchers', function(done) {
  if(config.less.watcherPath) {
    gulp.watch(config.less.watcherPath, gulp.series('less'));
  }
  if(config.server.jsWatch) {
    gulp.watch(config.server.jsWatch, gulp.series('server'));
  }
  //gulp.watch(config.images.src, config.images.opt, ['images']);
  //gulp.watch(config.js.src, config.js.opt, ['js', 'injectHtml:dev']);
  done();
});

gulp.task('watchers:sass', function() {
  gulp.watch(config.sass.watcherPath, ['sass']);
});

gulp.task('build', gulp.series(
  function setBuildEnv(done) {
    getConfig();
    $.isBuild = true;
    return done();
  },
  'clean',
  'less',
  //'userTask',
  gulp
    .parallel(
      'libCss',
      'js',
      'images',
      'fonts',
      'libJs',
      'server'
    ),
  'css',
  'injectHtml:prod'
));

// gulp.task('prod', gulp.series('build'));


gulp.task('static', gulp.series(
  function setStaticEnv(done) {
    $.isStatic = true;
    gulpConfig.alterableSetting.sourcePath = args.f || 'public';
    gulpConfig.alterableSetting.basePath = args.t || 'static';
    gulpConfig.setInjectSource();
    gulpConfig.alterableSetting.publicPath = gulpConfig.alterableSetting.basePath;
    gulpConfig.alterableSetting.viewPath = gulpConfig.alterableSetting.basePath;
    gulpConfig.alterableSetting.noHtml5Mode = true;
    gulpConfig.alterableSetting.noServer = true;
    return done();
  },
  'build'
));

gulp.task('default', gulp.series('static'));


// gulp.task('dev', gulp.series(
//   setDevEnv,
//   'clean',
//   gulp.parallel(
//     'libCss',
//     'less',
//     'js',
//     'server',
//     'fonts'
//   ),
//   'injectHtml:dev',
//   'browser-sync',
//   'watchers'
// ));

// gulp.task('quickStart', gulp.series(
//   setDevEnv,
//   'browser-sync',
//   'watchers'
// ));

var P = require('bluebird')
var fs = P.promisifyAll(require('fs'))
var path = require('path');
var spawn = require('child_process').spawn;

var config = require('./config.js');


var targetPath = process.argv[2];

if (targetPath === 'index') {
  indexHtml();
  return;
}

if (targetPath) {
  build(targetPath);
} else {
  P.map(config.projects, function(project, index) {
      console.log('index: ', index);
      console.log(project.name);
      targetPath = path.resolve(__dirname, '../copy/' + project.name);
      if (project.copy) {
        return copy(targetPath).reflect();
      }
      targetPath = path.resolve(__dirname, '../' + project.name);
      return build(targetPath, index).reflect();
    })
    .each(function(inspection, i) {
      if (inspection.isFulfilled()) {
        console.log('success: ', config.projects[i]);
      } else {
        console.error('error: ', config.projects[i], inspection.reason());
      }
      indexHtml();
    });
}

function copy(targetPath) {
  var targetPublicPath = path.resolve(__dirname, targetPath);
  var targetStaticPath;

  return fs.statAsync(targetPublicPath)
    .then(function() {
      targetStaticPath = path.resolve(__dirname, '../deploy/' + targetPublicPath.replace(/.*[\\\/]/, ''));
    })
    .then(function() {
      return execCmd('cp', ['-r', targetPublicPath, targetStaticPath])
        .catch(function(e) {
          console.log(e);
        })
        .finally(function() {
          // var gitPath = path.resolve(__dirname, '../deploy/' + targetPublicPath.replace(/.*[\\\/]/, '') + '/.git');
          // return fs.statAsync(gitPath)
          //   .then(function() {
          //     return execCmd('rm', ['-rf', '../deploy/' + targetPublicPath.replace(/.*[\\\/]/, '') + '/.git'])
          //   })
          //   .catch(function() {

          //   });
        })
    });
}

function build(targetPath, index) {
  var targetPublicPath = path.resolve(__dirname, targetPath);
  var targetStaticPath;

  return fs.statAsync(targetPublicPath)
    .then(function() {
      targetStaticPath = path.resolve(__dirname, '../deploy/' + targetPublicPath.replace(/.*[\\\/]/, ''));
    })
    .then(function() {
      return execCmd('rm', ['-rf', 'public' + index])
    })
    .then(function() {
      return execCmd('rm', ['-rf', 'static' + index])
    })
    .then(function() {
      return execCmd('cp', ['-r', targetPublicPath, path.resolve(__dirname, 'public' + index)])
    })
    .then(function() {
      return fs.statAsync(path.resolve(__dirname, 'public' + index + '/.git'))
        .then(function() {
          return execCmd('rm', ['-rf', 'public' + index + '/.git'])
        })
        .catch(function() {

        });
    })
    .then(function() {
      return execCmd('gulp', ['static', '-f', 'public' + index, '-t', 'static' + index], {
        platform: true
      })
    })
    .then(function() {
      return execCmd('rm', ['-rf', targetStaticPath]);
    })
    .then(function() {
      return execCmd('mv', ['static' + index, targetStaticPath])
    })
    .then(function() {
      return execCmd('rm', ['-rf', 'public' + index]);
    });
}


function execCmd(cmd, arg, options) {
  return new P(function(resolve, reject) {
    if (options && options.platform === true) {
      cmd = (process.platform === 'win32' ? (cmd + '.cmd') : cmd);
    }
    spawn(cmd, arg, {
        stdio: 'inherit'
      })
      .on('error', function(err) {
        console.log(err);
      })
      .on('exit', function(code) {
        if (code !== 0) {
          return reject(code);
        }
        resolve();
      });
  });
}


function indexHtml() {
  var arr = config.projects.map(function(project) {
    return '\'<a href="./' + project.name + '/" target="_blank">' + (project.intro || project.name) + '</a>\''
  });


  fs.readFileAsync('./index.html')
    .then(function(data) {
      var str = (data + '').replace('var arr = [];', 'var arr=[' + arr.join(',') + '];');
      return fs.writeFile('../deploy/index.html', str);
    })
    .then(function() {
      console.log('index.html success');
    })
}

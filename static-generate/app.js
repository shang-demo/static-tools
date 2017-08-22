var P = require('bluebird')
var fs = P.promisifyAll(require('fs'))
var path = require('path');
var spawn = require('child_process').spawn;

var config = require('./config.js');


var targetProjects = process.argv.slice(2);

if (targetProjects.length === 1 && targetProjects[0] === 'index') {
  indexHtml();
  return;
}

if (targetProjects.length) {
  config.projects = config.projects.filter(function (project) {
    return targetProjects.indexOf(project.name) >= 0;
  });
  console.info('config.projects: ', config.projects);
}

  console.info('config.projects: ', config.projects);

P
  .map(config.projects, function (project, index) {
    console.log('index: ', index);
    console.log(project.name);
    if (project.url) {
      return null;
    }
    var targetPath = '';
    if (project.copy === true) {
      return copy(project).reflect();
    }

    return P
      .resolve()
      .then(function () {
        targetPath = path.resolve(__dirname, '../' + project.name);
        return build(targetPath, index);
      })
      .then(function (data) {
        if (project.copy && project.copy.length) {
          return P.map(project.copy, function (item) {
            return copy(project, item);
          });
        }
        return data;
      })
      .reflect();
  })
  .each(function (inspection, i) {
    if (inspection.isFulfilled()) {
      console.log('success: ', config.projects[i]);
    }
    else {
      console.error('error projects: ', config.projects[i]);
      console.error('error reason:', inspection.reason())
    }
  })
  .then(function () {
    return indexHtml();
  })
  .catch(function (e) {
  });


function pathResolve(project, src, prefixPath) {
  src = src || '';
  prefixPath = prefixPath || '';
  var resolvedPath;
  // 绝对路径
  if (path.isAbsolute(src)) {
    resolvedPath = src;
  }
  // 相对路径
  else if (/^\./.test(src)) {
    resolvedPath = path.join(__dirname, src);
  }
  // 相对 project路径
  else {
    resolvedPath = path.join(__dirname, prefixPath || '', project.name, src);
  }

  return resolvedPath;
}
function copy(project, src, dest) {
  var srcPath;
  var destPath;

  if (src && src.src && src.dest) {
    dest = src.dest;
    src = src.src;
  }

  // 项目直接复制
  if (project && !src && !dest) {
    srcPath = path.join(__dirname, '../copy', project.name);
    destPath = path.join(__dirname, '../deploy', project.name);
  }
  else {
    srcPath = pathResolve(project, src, '../');
    destPath = pathResolve(project, dest, '../deploy');
  }

  console.info('copy -r ' + srcPath + ' ' + destPath);
  return fs.statAsync(srcPath)
    .then(function () {
      return execCmd('cp', ['-r', srcPath, destPath]);
    });
}

function build(targetPath, index) {
  index = index === undefined ? 0 : index;
  var targetPublicPath = path.resolve(__dirname, targetPath);
  var targetStaticPath;

  return fs.statAsync(targetPublicPath)
    .then(function () {
      targetStaticPath = path.resolve(__dirname, '../deploy/' + targetPublicPath.replace(/.*[\\\/]/, ''));
    })
    .then(function () {
      return execCmd('rm', ['-rf', 'public' + index])
    })
    .then(function () {
      return execCmd('rm', ['-rf', 'static' + index])
    })
    .then(function () {
      return execCmd('cp', ['-r', targetPublicPath, path.resolve(__dirname, 'public' + index)])
    })
    .then(function () {
      return fs.statAsync(path.resolve(__dirname, 'public' + index + '/.git'))
        .then(function () {
          return execCmd('rm', ['-rf', 'public' + index + '/.git'])
        })
        .catch(function () {

        });
    })
    .then(function () {
      return execCmd('gulp', ['static', '-f', 'public' + index, '-t', 'static' + index], {
        platform: true
      })
    })
    .then(function () {
      return execCmd('rm', ['-rf', targetStaticPath]);
    })
    .then(function () {
      return execCmd('mv', ['static' + index, targetStaticPath])
    })
    .then(function () {
      return execCmd('rm', ['-rf', 'public' + index]);
    });
}

function execCmd(cmd, arg, options) {
  return new P(function (resolve, reject) {
    if (options && options.platform === true) {
      cmd = (process.platform === 'win32' ? (cmd + '.cmd') : cmd);
    }
    spawn(cmd, arg, {
      stdio: 'inherit'
    })
      .on('error', function (err) {
        console.log(JSON.stringify(err, null, 2));
      })
      .on('exit', function (code) {
        if (code !== 0) {
          return reject(code);
        }
        resolve();
      });
  });
}

function indexHtml() {
  var arr = config.projects
    .filter(function (project) {
      return project.indexShow !== false;
    })
    .map(function (project) {
      if (project.url) {
        return '\'<a href="' + project.url + '" target="_blank">' + (project.intro || project.name) + '</a>\'';
      }

      return '\'<a href="./' + project.name + '/" target="_blank">' + (project.intro || project.name) + '</a>\'';
    });

  return fs.readFileAsync('./index.html')
    .then(function (data) {
      var str = (data + '').replace('var arr = [];', 'var arr=[' + arr.join(',') + '];');
      return fs.writeFile('../deploy/index.html', str);
    })
    .then(function () {
      console.log('index.html success');
    })
}

module.exports = {
  projects: [{
    name: 'diff',
    cmd: {
      pre: ['make build prod'],
    },
    build: false,
    copy: ['dist/'],
  }, {
    name: 'diff2',
    indexShow: false,
  }, {
    name: 'je',
    copy: true
  }, {
    name: 'stringchange',
    copy: ['jsmin.js']
  }, {
    name: 'regexp',
    url: 'https://regexp.xinshangshangxin.com/',
  }, {
    name: 'regexp-parsing'
  }, {
    name: 'runhtml',
    url: 'http://runhtml.xinshangshangxin.com/',
  }, {
    name: 'cron'
  }, {
    name: 'ssh-site',
    copy: true
  }, {
    name: 'port-scan',
    copy: [{
      src: 'js/js.portscan.js',
      dest: 'js/js.portscan.js',
    }]
  }, {
    name: 'RGB'
  }, {
    name: 'html5table',
    copy: true
  }, {
    name: 'stylie',
    copy: true
  }, {
  	name: 'charref'
  }, {
    name: 'ip-detect',
    url: 'http://ip-detect.leanapp.cn/',
  }, {
    name: 'browser-detect'
  }, {
    name: 'cloudnapps',
    cmd: {
      pre: ['make build'],
    },
    build: false,
    copy: ['dist/'],
    indexShow: false,
  }, {
    name: 'local-warning',
    indexShow: false,
  }, {
    name: 'echo-search',
    indexShow: false,
  }, {
    name: 'curl2doc',
    cmd: {
      pre: ['make build'],
    },
    build: false,
    copy: ['dist/'],
  }]
};

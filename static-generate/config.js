module.exports = {
  projects: [{
    name: 'diff'
  }, {
    name: 'je',
    copy: true
  }, {
    name: 'stringchange',
    copy: ['jsmin.js']
  }, {
    name: 'regexp'
  }, {
    name: 'runhtml'
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
  }]
};

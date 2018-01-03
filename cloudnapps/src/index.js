/** cdn import */
import $ from 'jquery';
import 'bootstrap';
import md5 from 'blueimp-md5';
import Clipboard from 'clipboard';
/** cdn import end */

import JSON5 from 'json5';

import './index.css';

function loadJobName() {
  let jobCopys = {
    BusinessAreaLabel: {},
    CrossUserCodeMacAddress: {},
    HomeTownshipLabel: {},
    WorkTownshipLabel: {},
    EnterPoiDeviceDate: {},
    EnterLocDeviceDate: {},
    DeviceAppLabel: {
      properties: {
        'cn.magicsdk.cube.connections.input': 'deviceMongo',
      },
    },
    DeviceApps: {
      properties: {
        'cn.magicsdk.cube.connections.input': 'deviceMongo',
      },
    },
    DevicePoiBrandLabel: {},
    DevicePoiCategoryDate: {},
    DevicesTrend: {},
    DevicesTrendByAppWant: {},
    DevicesTrendHeatMap: {},
    DevicesTrendHeatMapByAppWant: {},
    NearbyPoisDeviceTrend: {},
    NearbyPoisTrend: {},
    RealtimeEnterLocDeviceDate: {},
    RealtimeVisitsHeatMapByAppWant: {},
    Test: {},
    UserTypeTrend: {},
    UserTypeTrendByAppWant: {},
    UserTypeTrendHeatMap: {},
    UserTypeTrendHeatMapByAppWant: {},
    VisitsTrend: {},
    VisitsTrendByAppWant: {},
    VisitsTrendHeatMap: {},
    VisitsTrendHeatMapByAppWant: {},
  };

  let options = Object.keys(jobCopys).map((key) => {
    return `<option value="${key}">${key}</option>`;
  }).join('\n');
  $('#jobName').html(options);
}

function getCollectionName(dimensionsStr, jobName) {
  if (!/cn\.magicsdk\.cube\.jobs\./.test(jobName)) {
    jobName = `cn.magicsdk.cube.jobs.${jobName}`;
  }

  let dimensions;
  try {
    dimensions = JSON5.parse(dimensionsStr);
  }
  catch (e) {
    dimensions = dimensionsStr.split(/\s+/);
  }

  if (!Array.isArray(dimensions)) {
    dimensions = [dimensions];
  }

  dimensionsStr = `${jobName}:${dimensions.sort().join('|')}`;
  console.log('dimensionsStr: ', dimensionsStr);
  return `cp_${md5(dimensionsStr)}`;
}

function loadBtnCopy() {
  let clipboard = new Clipboard('.copy-btn');

  clipboard.on('success', (e) => {
    console.info('Action:', e.action);
    console.info('Text:', e.text);
    console.info('Trigger:', e.trigger);

    e.clearSelection();
  });

  clipboard.on('error', (e) => {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
  });
}

function getQs() {
  let qs = {};
  window.location.search.substr(1).split('&').forEach((item) => {
    let s = item.split('=');
    let k = s[0];
    let v = s[1] && decodeURIComponent(s[1]);
    try {
      // eslint-disable-next-line no-new-func
      v = new Function(`return ${v}`)();
    }
    catch (e) {
      // nothing
    }
    (qs[k] = qs[k] || []).push(v);
  });
  Object.keys(qs).forEach((key) => {
    if (qs[key] && qs[key].length === 1) {
      // eslint-disable-next-line prefer-destructuring
      qs[key] = qs[key][0];
    }
  });

  return qs;
}

function getHash() {
  let qs = {};
  window.location.href.replace(/.*?#\//, '').split('&').forEach((item) => {
    let s = item.split('=');
    let k = s[0];
    let v = s[1] && decodeURIComponent(s[1]);
    try {
      // eslint-disable-next-line no-new-func
      v = new Function(`return ${v}`)();
    }
    catch (e) {
      // eslint-disable-next-line no-empty
    }
    (qs[k] = qs[k] || []).push(v);
  });
  Object.keys(qs).forEach((key) => {
    if (qs[key] && qs[key].length === 1) {
      // eslint-disable-next-line prefer-destructuring
      qs[key] = qs[key][0];
    }
  });
  return qs;
}

function setResult() {
  let arr = $('#dimensions').val().split(/[\r\n]/);
  let result = arr
    .filter((key) => {
      return key;
    })
    .map((key) => {
      key = key.trim();
      return {
        [key]: getCollectionName(key, $('#jobNameHandle').val() || $('#jobName').val()),
      };
    });

  if (!result.length) {
    result = '';
  }
  if (result.length === 1) {
    result = result[0][Object.keys(result[0])[0]];
  }
  else {
    result = JSON.stringify(result);
  }

  $('#result').val(result);
}

function watchChange() {
  $('#dimensions').bind('input propertychange', () => {
    setResult();
  });

  $('#jobName').bind('input propertychange', () => {
    setResult();
  });

  $('#jobNameHandle').bind('input propertychange', () => {
    setResult();
  });

  $('#domain').bind('input propertychange', () => {
    buildNginxConf();
  });
  $('#port').bind('input propertychange', () => {
    buildNginxConf();
  });

  $('#jobContent').bind('input propertychange', () => {
    listJobs();
  });
}

let getDomain = (function getDomain() {
  let a = document.createElement('a');
  return (url) => {
    url = (url || '').trim();
    if (!/http/.test(url)) {
      url = `http://${url}`;
    }
    a.setAttribute('href', url);
    return a.hostname;
  };
}());

function buildNginxConf() {
  let domain = $('#domain').val();
  let port = $('#port').val();
  domain = getDomain(domain);

  let arr = domain.split('.');
  let str1 = arr.join('_');
  let str2 = arr.slice(0, arr.length - 2).join('-');
  let conf = `# HTTP server
upstream ${str1}_backend {
  server 127.0.0.1:${port};
}
# HTTPS server
#
server {
  listen      80;
  server_name ${domain};
  gzip on;
  gzip_proxied any;
  gzip_types text/plain text/xml text/css application/x-javascript application/javascript;
  gzip_vary on;
  gzip_disable "MSIE [1-6]\\.(?!.*SV1)";
  access_log      /var/log/nginx/${str2}-access.log;
  error_log       /var/log/nginx/${str2}-error.log;
  keepalive_timeout    60;
  client_max_body_size    10m;
  error_page 502 /504.html;
  error_page 504 /504.html;
  location /504.html {
    root /home/nodeadmin/static/;
  }
  location / {
    proxy_pass  http://${str1}_backend;
    ### force timeouts if one of backend is died ##
    proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
    ### Set headers ####
    proxy_set_header        Accept-Encoding   "";
    proxy_set_header        Host            $host;
    proxy_set_header        X-Real-IP       $remote_addr;
    proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header        X-Forwarded-Proto $scheme;
    add_header              Front-End-Https   on;
    ### By default we don't want to redirect it ####
    proxy_redirect     off;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
    `;

  $('#nginxConf').val(conf);
}

function listJobs() {
  let str = $('#jobContent').val();

  let jobNameReg = /public\s+class\s+(\w+)\s+extends\s+CubeJob/m;
  let jobName = str.match(jobNameReg)[1];

  let jobDimensionsReg = /\.setOutputDimensions\("([^"]+)"\)/g;

  let arr = [];
  let m;
  // eslint-disable-next-line no-cond-assign
  while ((m = jobDimensionsReg.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === jobDimensionsReg.lastIndex) {
      jobDimensionsReg.lastIndex += 1;
    }

    arr.push(m[1]);
  }

  console.info('jobName: ', jobName);
  console.info(arr);

  let jobList = arr
    .map((item) => {
      return {
        str: item,
        name: getCollectionName(item, jobName),
      };
    });

  let jobHtml = jobList.reduce((result, obj) => {
    result = `${result} <tr><td>${obj.str}</td><td>${obj.name}</td></tr>`;
    return result;
  }, '');


  $('#jobResult').html(`<tr>
        <th>dimension</th>
        <th>collectionName</th>
      </tr>
    ${jobHtml}`);

  $('#delJob').html(jobList.map((item) => {
    return `db.${item.name}.drop();`;
  }).join('<br>'));
}


$(() => {
  loadJobName();
  loadBtnCopy();

  let qs = getQs();
  let hash = getHash();

  if (qs.dimensions || hash.dimensions) {
    $('#dimensions').val(qs.dimensions || hash.dimensions);
  }
  if (qs.job || hash.job) {
    $('#jobName').val(qs.job || hash.job);
  }

  setResult();
  watchChange();
});

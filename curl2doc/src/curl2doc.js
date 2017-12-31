const parseCurl = require('parse-curl');
const JSON5 = require('json5');
const url = require('url');

function toString(value, { space = 2 } = {}) {
  if (!value) {
    return '';
  }

  try {
    value = JSON.parse(value);
  }
  catch (e) {

  }

  let type = ({}).toString.call(value);
  type = type.substring(8, type.length - 1);
  if (type === 'String' || type === 'Number' || type === 'Boolean') {
    return value;
  }
  if (type === 'RegExp') {
    return value.valueOf() + value.flags;
  }

  return JSON.stringify(value, null, space).replace(/[\r\n]/g, '<br>').replace(/\s/g, '&nbsp;');
}

function buildDoc(obj, { curl, space, header, headerAuthorization } = {}) {
  console.info('obj: ', obj);
  let str = '';
  str += `### URL  
\`${obj.method} ${obj.pathname}\`
`;

  if (header && obj.header && Object.keys(obj.header).length) {
    str += '### Header  \n参数名 | 例子 | 描述 |\n---- | ---| ---\n';

    Object.keys(obj.header).forEach((key) => {
      console.info('key: ', key, headerAuthorization);
      if (!headerAuthorization && key === 'authorization') {
        return;
      }

      str += `${key} | ${toString(obj.header[key], { space })} | \n`;
    });
  }

  if (obj.query && Object.keys(obj.query).length) {
    str += '### Query String  \n参数名 | 例子 | 描述 |\n---- | ---| ---\n';

    Object.keys(obj.query).forEach((key) => {
      str += `${key} | ${toString(obj.query[key], { space })} | \n`;
    });
  }

  if (obj.body && Object.keys(obj.body).length) {
    str += '### Body  \n参数名 | 例子 | 描述 |\n---- | ---| ---  \n';

    Object.keys(obj.body).forEach((key) => {
      str += `${key} | ${toString(obj.body[key], { space })} | \n`;
    });
  }

  if (curl) {
    str += '### curl  \n\n```bash\n' + obj.curl + '\n```\n';
  }

  return str;
}

function curl2doc(str = '', { doc = true, curl = true, space = 2, header = false, headerAuthorization = false } = {}) {
  str = str.trim();
  let parseResult = parseCurl(str);

  if (parseResult.header && parseResult.header['content-type']) {
    delete parseResult.header['Content-Type'];
  }

  try {
    if (parseResult.body) {
      parseResult.body = JSON5.parse(parseResult.body);
    }
  }
  catch (e) {
  }

  let qs = url.parse(parseResult.url, true);

  parseResult.query = qs.query;
  parseResult.pathname = qs.pathname;
  parseResult.curl = str;

  if (!doc) {
    return parseResult;
  }

  return buildDoc(parseResult, { curl, space, header, headerAuthorization });
}


module.exports = curl2doc;
import parseCurl from 'parse-curl';
import JSON5 from 'json5';
import { parse as urlParse } from 'url';

function toString(value, { space = 2 } = {}) {
  if (!value) {
    return '';
  }

  try {
    value = JSON.parse(value);
  }
  catch (e) {
    //  do nothing
  }

  let type = {}.toString.call(value);
  type = type.substring(8, type.length - 1);
  if (type === 'String' || type === 'Number' || type === 'Boolean') {
    return value;
  }
  if (type === 'RegExp') {
    return value.valueOf() + value.flags;
  }

  return JSON.stringify(value, null, space)
    .replace(/[\r\n]/g, '<br>')
    .replace(/\s/g, '&nbsp;');
}

function buildDoc(obj, {
  curl, space, header, headerAuthorization,
} = {}) {
  let descriptionList = {
    authorization: 'accessToken 从登录接口中获取',
    fromDate: '开始日期',
    toDate: '结束日期',
  };

  let headerIgnoreKey = [
    'DNT',
    'Accept-Encoding',
    'Accept-Language',
    'User-Agent',
    'Accept',
    'Referer',
    'Cookie',
    'If-None-Match',
    'Connection',
  ];
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

      let ignoreIndex = headerIgnoreKey.findIndex((ignoreKey) => {
        if (ignoreKey === key || ignoreKey.toLocaleLowerCase() === key) {
          return true;
        }
        return false;
      });

      if (ignoreIndex >= 0) {
        return;
      }

      str += `${key} | ${toString(obj.header[key], { space })}  | ${descriptionList[key] ||
        ''} | \n`;
    });
  }

  if (obj.query && Object.keys(obj.query).length) {
    str += '### Query String  \n参数名 | 例子 | 描述 |\n---- | ---| ---\n';

    Object.keys(obj.query).forEach((key) => {
      str += `${key} | ${toString(obj.query[key], { space })} | ${descriptionList[key] || ''} | \n`;
    });
  }

  if (obj.body && Object.keys(obj.body).length) {
    str += '### Body  \n参数名 | 例子 | 描述 |\n---- | ---| ---  \n';

    Object.keys(obj.body).forEach((key) => {
      str += `${key} | ${toString(obj.body[key], { space })} | \n`;
    });
  }

  if (curl) {
    str += `### curl  \n\n\`\`\`bash\n${obj.curl}\n\`\`\`\n`;
  }

  return str;
}

function curl2doc(
  str = '',
  {
    doc = true, curl = true, space = 2, header = false, headerAuthorization = false,
  } = {}
) {
  str = str.trim();
  // eslint-disable-next-line no-template-curly-in-string
  str = str.replace(/Bearer\s[^']*/, 'Bearer ${accessToken}');

  let parseResult = parseCurl(str);
  console.log('parseResult: ', parseResult);

  if (parseResult.header && parseResult.header['content-type']) {
    delete parseResult.header['Content-Type'];
  }

  try {
    if (parseResult.body) {
      parseResult.body = JSON5.parse(parseResult.body);
    }
  }
  catch (e) {
    console.warn(e);
  }

  console.info('parseResult.url: ', parseResult.url);
  let qs = urlParse(parseResult.url, true);

  parseResult.query = qs.query;
  parseResult.pathname = qs.pathname;
  // eslint-disable-next-line no-template-curly-in-string
  parseResult.curl = str.replace(/https?:\/\/(127.0.0.1|localhost)(:\d+)?\//, '${SERVER_URL}/');

  if (!doc) {
    return parseResult;
  }

  return buildDoc(parseResult, {
    curl,
    space,
    header,
    headerAuthorization,
  });
}

export default curl2doc;

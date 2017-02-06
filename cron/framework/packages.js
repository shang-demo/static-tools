const cronParser = require('cron-parser');
window.cronParser = cronParser;

window.formatDate = function (fmt, date = new Date()) {
  let o = {
    '(y+)': date.getFullYear(),
    '(M+)': date.getMonth() + 1, // 月份
    '(d+)': date.getDate(), // 日
    '(h+)': date.getHours(), // 小时
    '(m+)': date.getMinutes(), // 分
    '(s+)': date.getSeconds(), // 秒
    '(q+)': Math.floor((date.getMonth() + 3) / 3), // 季度
    '(S+)': date.getMilliseconds(), // 毫秒
  };

  Object.keys(o).forEach((key) => {
    if (new RegExp(key).test(fmt)) {
      // eslint-disable-next-line no-param-reassign
      fmt = fmt.replace(RegExp.$1, (`00${o[key]}`).substr(-RegExp.$1.length));
    }
  });

  return fmt;
};

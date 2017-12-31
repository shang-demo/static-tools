require('./index.css');

const curl2doc = require('./curl2doc');
const makeHtml = require('./make-html');


function loadOptions() {
  let options = getConfig();
  $('#space').val(options.space);
  $('#showCurl').prop('checked', options.curl);
  $('#showHeader').prop('checked', options.header);
  $('#showHeaderAuthorization').prop('checked', options.headerAuthorization);
}

function loadBtnCopy(selector) {
  let clipboard = new Clipboard(selector);

  clipboard.on('success', function (e) {
    console.info('Action:', e.action);
    console.info('Text:', e.text);
    console.info('Trigger:', e.trigger);

    e.clearSelection();
  });

  clipboard.on('error', function (e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
  });
}

function getConfig() {
  let str = localStorage.getItem('options');
  try {
    return JSON.parse(str) || {};
  }
  catch (e) {
    return {};
  }
}

function saveConfig(options) {
  localStorage.setItem('options', JSON.stringify(options));
}

function watchInputField(selector, fun) {
  $(selector).bind('input propertychange', fun);
}

function showDoc() {
  let str = $('#curlStr').val();
  let space = parseInt($('#space').val()) || 0;
  let showCurl = !!$('#showCurl').prop('checked');
  let header = !!$('#showHeader').prop('checked');
  let headerAuthorization = !!$('#showHeaderAuthorization').prop('checked');
  let options = { space, curl: showCurl, header, headerAuthorization };
  console.info('options: ', options);
  saveConfig(options);

  let doc = curl2doc(str, options);

  $('#doc').val(doc);
  showHtml();
}

function showHtml() {
  $('#html').html(
    makeHtml($('#doc').val())
  );
}

watchInputField('#curlStr', showDoc);
watchInputField('#space', showDoc);
watchInputField('#showCurl', showDoc);
watchInputField('#doc', showHtml);

$('input[type=checkbox]').bind('change', function () {
  showDoc();
});

loadBtnCopy('.copy-btn');

loadOptions();
showDoc();
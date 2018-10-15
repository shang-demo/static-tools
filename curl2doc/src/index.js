import './index.css';

import curl2doc from './curl2doc';
import makeHtml from './make-html';

function loadOptions() {
  let options = getConfig();
  $('#space').val(options.space);
  $('#showCurl').prop('checked', options.curl);
  $('#showHeader').prop('checked', options.header);
  $('#showHeaderAuthorization').prop('checked', options.headerAuthorization);
}

function loadBtnCopy(selector) {
  let clipboard = new Clipboard(selector);

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

function getConfig() {
  let str = localStorage.getItem('options');
  try {
    return (
      JSON.parse(str) || {
        space: 2,
        curl: true,
        header: true,
        headerAuthorization: true,
      }
    );
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
  let space = parseInt($('#space').val(), 10) || 0;
  let showCurl = !!$('#showCurl').prop('checked');
  let header = !!$('#showHeader').prop('checked');
  let headerAuthorization = !!$('#showHeaderAuthorization').prop('checked');
  let options = {
    space,
    curl: showCurl,
    header,
    headerAuthorization,
  };
  console.info('options: ', options);
  saveConfig(options);

  let doc = curl2doc(str, options);

  $('#doc').val(doc);
  showHtml();
}

function showHtml() {
  $('#html').html(makeHtml($('#doc').val()));
}

function loadPerset() {
  let { href } = window.location;
  let base64 = href.split('?')[1];

  console.log('base64: ', base64);

  if (!base64) {
    return null;
  }

  try {
    let curl = window.atob(base64);
    console.log('curl: ', curl);

    $('#curlStr').val(curl);
  }
  catch (e) {
    let curl = decodeURIComponent(base64);
    console.log('curl: ', JSON.stringify(curl));

    $('#curlStr').val(curl);
  }

  return null;
}

watchInputField('#curlStr', showDoc);
watchInputField('#space', showDoc);
watchInputField('#showCurl', showDoc);
watchInputField('#doc', showHtml);

$('input[type=checkbox]').bind('change', () => {
  showDoc();
});

loadBtnCopy('.copy-btn');

loadOptions();
loadPerset();
showDoc();

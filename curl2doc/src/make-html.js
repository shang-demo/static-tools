import showdown from 'showdown';

const classMap = {
  table: 'table table-bordered',
};
const bindings = Object.keys(classMap).map((key) => {
  return {
    type: 'output',
    regex: new RegExp(`<${key}([^>]*)>`, 'g'),
    replace: `<${key} class="${classMap[key]}" $1>`,
  };
});

const converter = new showdown.Converter({
  extensions: [...bindings],
  tables: true,
});

function makeHtml(str) {
  return converter.makeHtml(str);
}

export default makeHtml;

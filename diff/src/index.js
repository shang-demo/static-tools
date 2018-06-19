/** cdn import */
import 'bootstrap';
/** cdn import end */

import 'codemirror/lib/codemirror.css';
import CodeMirror from 'codemirror/lib/codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/merge/merge';
import 'codemirror/addon/merge/merge.css';
import DiffMatchPatch from 'diff-match-patch';

import './index.css';

window.diff_match_patch = DiffMatchPatch;
window.DIFF_INSERT = DiffMatchPatch.DIFF_INSERT;
window.DIFF_DELETE = DiffMatchPatch.DIFF_DELETE;
window.DIFF_EQUAL = DiffMatchPatch.DIFF_EQUAL;

function initUI() {
  let target = document.getElementById('view');

  let mv = CodeMirror.MergeView(target, {
    lineWiseCopyCut: true,
    lineWrapping: true,
    value: '',
    orig: '',
    connect: 'align',
    allowEditingOriginals: true,
    lineNumbers: true,
    mode: 'javascript',
  });

  mv.editor().setSize('100%', window.innerHeight - 10);
}

initUI();

import VMdEditor from '@kangc/v-md-editor/lib/codemirror-editor';
import '@kangc/v-md-editor/lib/style/codemirror-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';

// highlightjs
import hljs from 'highlight.js';

// codemirror 编辑器的相关资源
import Codemirror from '@kangc/v-md-editor/node_modules/codemirror';
// mode
import '@kangc/v-md-editor/node_modules/codemirror/mode/markdown/markdown';
import '@kangc/v-md-editor/node_modules/codemirror/mode/javascript/javascript';
import '@kangc/v-md-editor/node_modules/codemirror/mode/css/css';
import '@kangc/v-md-editor/node_modules/codemirror/mode/htmlmixed/htmlmixed';
import '@kangc/v-md-editor/node_modules/codemirror/mode/vue/vue';
// // edit
import '@kangc/v-md-editor/node_modules/codemirror/addon/edit/closebrackets';
import '@kangc/v-md-editor/node_modules/codemirror/addon/edit/closetag';
import '@kangc/v-md-editor/node_modules/codemirror/addon/edit/matchbrackets';
// placeholder
import '@kangc/v-md-editor/node_modules/codemirror/addon/display/placeholder';
// active-line
import '@kangc/v-md-editor/node_modules/codemirror/addon/selection/active-line';
// // scrollbar
import '@kangc/v-md-editor/node_modules/codemirror/addon/scroll/simplescrollbars';
import '@kangc/v-md-editor/node_modules/codemirror/addon/scroll/simplescrollbars.css';
// // style
import '@kangc/v-md-editor/node_modules/codemirror/lib/codemirror.css';

import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/cdn';

VMdEditor.Codemirror = Codemirror;
VMdEditor.use(githubTheme, {
    Hljs: hljs,
});
VMdEditor.use(createKatexPlugin())

export default VMdEditor
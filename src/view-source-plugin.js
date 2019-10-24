const LINE_BREAKS_REGEX = /(\r\n|\n|\r)/gm;
const CLASS_PLUGIN_EXAMPLE = 'docsify-example';
const CLASS_HIDDEN = '__docsify-view-source-hidden';
const CLASS_PREVIEW = '__docsify-view-source-preview';
const CLASS_CODE_SOURCE = '__docsify-view-source-code';
const CLASS_VIEW_SOURCE_PLUGIN_CONTAINER = '__docsify-view-source-container';

const noop = v => v;

const addPluginCodeClick = elm =>
  elm.addEventListener('click', evt => {
    const notVisible = elm.querySelector(`:scope > .${CLASS_HIDDEN}`);
    const visible = elm.querySelector(`:scope > :not(.${CLASS_HIDDEN})`);
    notVisible.classList.remove(CLASS_HIDDEN);
    visible.classList.add(CLASS_HIDDEN);
  });

const createPluginCodeViews = (nodeElement, marked) => {
  const { parentNode, innerHTML } = nodeElement;

  // creation du container
  const container = document.createElement('div');
  container.className = CLASS_VIEW_SOURCE_PLUGIN_CONTAINER;
  parentNode.insertBefore(container, nodeElement);

  // creation du container de preview
  const preview = document.createElement('div');
  preview.className = CLASS_PREVIEW;
  container.appendChild(preview);

  // creation du container de code source
  const sourceCode = document.createElement('div');
  sourceCode.className = `${CLASS_CODE_SOURCE} ${CLASS_HIDDEN}`;
  container.appendChild(sourceCode);

  // insertion du code d'example sans les sauts de ligne
  const cleanInnerHTML = innerHTML.trim().replace(LINE_BREAKS_REGEX, '');
  preview.innerHTML = cleanInnerHTML;

  // insertion du code source en markdown
  let markdownSourceContent = `${'```html'}\n${innerHTML}\n${'```'}`;
  markdownSourceContent = marked.lexer(markdownSourceContent);
  markdownSourceContent = marked.parser(markdownSourceContent);
  sourceCode.innerHTML = markdownSourceContent;

  // retourne l'element d'origine
  return nodeElement;
};

const viewSourcePlugin = function(hook, vm) {
  const marked = window.marked || noop;
  hook.doneEach(() => {
    let queriesElts = document.querySelectorAll(`.${CLASS_PLUGIN_EXAMPLE}`);
    let targets = Array.apply(null, queriesElts);
    targets
      .map(elt => createPluginCodeViews(elt, marked))
      .forEach(elt => elt.parentNode.removeChild(elt));

    // add clicks
    const classe = `.${CLASS_VIEW_SOURCE_PLUGIN_CONTAINER}`;
    queriesElts = document.querySelectorAll(classe);
    targets = Array.apply(null, queriesElts);
    targets.forEach(addPluginCodeClick);
  });
};

window.$docsify = window.$docsify || {};
window.$docsify.plugins = [viewSourcePlugin].concat(
  window.$docsify.plugins || []
);

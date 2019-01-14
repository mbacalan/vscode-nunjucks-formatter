const vscode = require("vscode");
const prettydiff = require("prettydiff2");

const id = "nunjucks";
var njkconfig = vscode.workspace.getConfiguration(`${id}-format`);

function format(document, range, options) {
  const result = [];
  const content = document.getText(range);
  const editor = vscode.window.activeTextEditor.options;
  const workspace = vscode.workspace.getConfiguration("editor");
  const defconfig = {
    source: content,
    lang: "twig",
    mode: "beautify",
    insize: editor.tabSize || workspace.tabSize,
    inchar: editor.insertSpaces ? " " : "\t"
  };

  njkconfig = { jekyll: njkconfig.frontmatter, ...njkconfig };
  delete njkconfig.frontmatter;
  const newText = prettydiff({
    ...defconfig,
    ...njkconfig
  });

  result.push(vscode.TextEdit.replace(range, newText));
  return result;
}

function activate(context) {
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider(id, {
      provideDocumentFormattingEdits(document, options) {
        const start = new vscode.Position(0, 0);
        const end = new vscode.Position(
          document.lineCount - 1,
          document.lineAt(document.lineCount - 1).text.length
        );
        const range = new vscode.Range(start, end);
        return format(document, range, options);
      }
    })
  );
}

exports.activate = activate;
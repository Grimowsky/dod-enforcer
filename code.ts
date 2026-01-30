// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

function traverse(node: SceneNode, cb: (n: SceneNode) => void): void {
  cb(node);
  if ("children" in node) {
    for (const child of node.children) {
      traverse(child, cb);
    }
  }
}

async function getTextStylesFromSelection() {
  const selection = figma.currentPage.selection;
  const textStyles: string[] = [];
  const promises: Promise<void>[] = [];

  selection.forEach((node) => {
    traverse(node, (n: SceneNode) => {
      if (n.type === "TEXT") {
        const id = n.textStyleId as string;
        const p = (async () => {
          const style = await figma.getStyleByIdAsync(id);
          textStyles.push(style ? style.name : "No Style");
        })();
        promises.push(p);
      }
    });
  });

  await Promise.all(promises);
  return textStyles;
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === "get-text-styles") {
    const result = await getTextStylesFromSelection();

    console.log("Text styles from selection:", result);

    figma.ui.postMessage({ type: "get-text-styles-result", data: result });
  }
};

// Runs this code if the plugin is run in Figma
if (figma.editorType === "figma") {
  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.

  figma.showUI(__uiFiles__.modal, { width: 400, height: 800 });
}

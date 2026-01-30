export function findFrameByName(name: string): FrameNode | null {
  const frame = figma.currentPage.findOne(
    (node) => node.type === "FRAME" && node.name === name,
  );
  return frame as FrameNode | null;
}

export function traverse(node: SceneNode, cb: (n: SceneNode) => void): void {
  cb(node);
  if ("children" in node) {
    for (const child of node.children) {
      traverse(child, cb);
    }
  }
}

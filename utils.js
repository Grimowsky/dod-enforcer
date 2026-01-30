export function findFrameByName(name) {
    const frame = figma.currentPage.findOne((node) => node.type === "FRAME" && node.name === name);
    return frame;
}
export function traverse(node, cb) {
    cb(node);
    if ("children" in node) {
        for (const child of node.children) {
            traverse(child, cb);
        }
    }
}

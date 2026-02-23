// Main plugin code — runs in the Figma sandbox environment.
// No access to browser APIs (DOM, fetch, etc.).
// Communicates with the UI via figma.ui.postMessage() / figma.ui.onmessage.

// Show the plugin UI
figma.showUI(__html__, { width: 320, height: 240 });

// Handle messages from the UI
figma.ui.onmessage = (msg: { type: string; [key: string]: any }) => {
  if (msg.type === "create-rectangle") {
    const rect = figma.createRectangle();
    rect.x = figma.viewport.center.x;
    rect.y = figma.viewport.center.y;
    rect.fills = [{ type: "SOLID", color: { r: 0.3, g: 0.5, b: 1 } }];
    figma.currentPage.appendChild(rect);
    figma.viewport.scrollAndZoomIntoView([rect]);
  }

  if (msg.type === "close") {
    figma.closePlugin();
  }
};

// UI code — runs inside an iframe with full browser APIs (DOM, fetch, etc.).
// Communicates with the plugin sandbox via parent.postMessage().

document.getElementById("create")!.addEventListener("click", () => {
  parent.postMessage({ pluginMessage: { type: "create-rectangle" } }, "*");
});

document.getElementById("close")!.addEventListener("click", () => {
  parent.postMessage({ pluginMessage: { type: "close" } }, "*");
});

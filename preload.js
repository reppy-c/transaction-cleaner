const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("app", {
  hello: () => "Hello from preload!",
  versions: process.versions,
});


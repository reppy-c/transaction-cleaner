const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("app", {
  hello: () => "Hello from preload!",
  versions: process.versions,
  selectCsvFile: () => ipcRenderer.invoke("select-csv-file"),
});


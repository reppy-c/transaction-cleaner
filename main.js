const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const fs = require("fs").promises;
const path = require("path");

let mainWindow = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));
}

async function handleSelectCsvFile() {
  const win = mainWindow ?? BrowserWindow.getFocusedWindow();
  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    properties: ["openFile"],
    filters: [{ name: "CSV", extensions: ["csv"] }],
  });
  if (canceled || !filePaths?.[0]) {
    return { canceled: true };
  }
  try {
    const content = await fs.readFile(filePaths[0], "utf-8");
    return { canceled: false, path: filePaths[0], content };
  } catch (err) {
    return { canceled: false, error: err.message };
  }
}

app.whenReady().then(() => {
  ipcMain.handle("select-csv-file", handleSelectCsvFile);
  createMainWindow();

  // macOS: re-create a window when clicking the dock icon
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on("window-all-closed", () => {
  // macOS apps typically stay running until Cmd+Q
  if (process.platform !== "darwin") app.quit();
});


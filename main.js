const { app, BrowserWindow, Menu, shell, ipcMain } = require("electron");

// to get rid of deprecated warning of default value false
app.allowRendererProcessReuse = true;

let win;
function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 400,
    webPreferences: {
      nodeIntegration: true
    }
  });

  const menu = Menu.buildFromTemplate([
    {
      label: "Menu",
      submenu: [
        {
          label: "Adjust Notification Value"
        },
        {
          label: "CoinMarketCap",
          click() {
            shell.openExternal("http://coinmarketcap.com");
          }
        },
        { type: "separator" },
        {
          label: "Exit",
          click() {
            app.quit();
          }
        }
      ]
    }
  ]);

  Menu.setApplicationMenu(menu);

  // and load the index.html of the app.
  // could show after 'ready-to-show' if too big of a page
  // to avoid visual flash while loading
  win.loadFile("src/index.html");

  // Open the DevTools.
  // win.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Receive arg from a renderer process on 'notify-price' channel
ipcMain.on("notify-price", (event, arg) => {
  // send arg to 'receive-price' channel of the win
  win.webContents.send("receive-price", arg);
});

const { remote, ipcRenderer } = require("electron");

const closeBtn = document.querySelector("#closeBtn");
const notifyVal = document.querySelector("#notifyVal");
const updateBtn = document.querySelector("#updateBtn");

closeBtn.addEventListener("click", () => {
  remote.getCurrentWindow().close();
});

updateBtn.addEventListener("click", () => {
  // Send message to main process
  ipcRenderer.send("notify-price", notifyVal.value);

  remote.getCurrentWindow().close();
});

// Receive reply from main process
// ipcRenderer.on("notify-price", (event, arg) => {
//   console.log(arg);
// });

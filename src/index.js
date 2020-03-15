const { remote, ipcRenderer } = require("electron");
const path = require("path");

const axios = require("axios");

const notifyBtn = document.querySelector("#notifyBtn");
const price = document.querySelector("#price");
const targetPrice = document.querySelector("#targetPrice");

let targetPriceVal = null;

const notification = {
  title: "BTC Alert!",
  body: "Bitcoin just beat your target price!",
  icon: path.join(__dirname, "../assets/images/btc.png")
};

function getBTC() {
  axios.get("https://api.coindesk.com/v1/bpi/currentprice.json").then(data => {
    let rate = data.data.bpi.USD.rate;

    // Rate has commas in it, remove the commas then parse the string to a number
    rate = +rate.split(",").join("");
    price.innerHTML = `$${rate}`;

    if (targetPriceVal && rate >= targetPriceVal) {
      // second arg is an obj { body: "..", icon: ".."} hence passed notificaton obj
      const myNotification = new Notification(notification.title, notification);
    }
  });
}

getBTC();
setInterval(() => {
  getBTC();
}, 2000);

notifyBtn.addEventListener("click", () => {
  const modalPath = path.join("file://", __dirname, "add.html");

  let win = new remote.BrowserWindow({
    show: false, // not show, but will show after 'ready-to-show' event
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    width: 400,
    height: 200,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadURL(modalPath);
  win.once("ready-to-show", () => {
    win.show();
  });

  // emitted after the window is closed
  win.on("closed", () => {
    // remove the reference as the window has closed
    win = null;
  });
});

ipcRenderer.on("receive-price", (event, price) => {
  targetPriceVal = price;
  targetPrice.innerHTML = `${price}`;
});

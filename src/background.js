'use strict';
import { app, protocol, BrowserWindow, ipcMain } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
const isDevelopment = process.env.NODE_ENV !== 'production';
import path from 'path';
import {db,connectDatabase,SelectPrenotazione,insertPrenotazione, selectUsers,insertUser, closeDatabase ,deletePrenotazione} from './dbmanager';
// Creazione della finestra principale
let mainWindow = null;

protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);

function createWindow() {
  return new Promise((resolve, reject) => {
    const win = new BrowserWindow({
      width: 1280,
      height: 1024,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration:true,
        contextIsolation: false,
      }
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
      win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
      if (!process.env.IS_TEST && win.webContents) win.webContents.openDevTools();
    } else {
      createProtocol('app');
      win.loadURL('app://./index.html');
    }

    win.once('ready-to-show', () => {
      resolve(win);
    });

    win.on('closed', () => {
      mainWindow = null;
    });
  });
}

app.on('window-all-closed', () => {
  ipcMain.removeAllListeners('fetch-users');
  if (process.platform !== 'darwin') {
    app.quit();
    closeDatabase();
  }
});

app.on('activate', () => {
  if (!mainWindow) {
    createWindow().then((window) => {
      
      mainWindow = window;
    
    });
  }
});

app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
  
  mainWindow = await createWindow();
  //await connectDatabase()
});

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}

ipcMain.on('fetch-users',async (event,data) => {
  console.log(event);
  console.log(data);
  let users = await selectUsers();
  await mainWindow.webContents.send('risposta',users);
});

ipcMain.on('load-prenotazioni',async (event,data) => {
  console.log(event);
  console.log(data);
  let pernotazioni = await SelectPrenotazione();
  await mainWindow.webContents.send('risposta',pernotazioni);
});

ipcMain.on('save-user',async (event,data) => {
  console.log(event);
  console.log(data);
  const name = data.name;
  insertUser(name);
  let risposta = {
    esito :"boh",
    test:name,
    data:data,
  }
  await mainWindow.webContents.send('risposta',risposta);
});

ipcMain.on('save-prenotazione',async (event,data) => {
  console.log(event);
  console.log(data);
  let prenotazione = data.prenotazione;
  let response = await insertPrenotazione(prenotazione);
  let risposta = {
    esito :true,
    response:response,
    data:prenotazione,
  }
  await mainWindow.webContents.send('risposta',risposta);
});

ipcMain.on('delete-prenotazione',async (event,data) => {
  console.log(event);
  console.log(data);
  let id = data.id;
  await deletePrenotazione(id);
  let risposta = {
    esito :true,
    id:id,
    data:data,
  }
  await mainWindow.webContents.send('risposta',risposta);
});

ipcMain.on('reload',async(event,data)=>{
  console.log(data);
  mainWindow.webContents.reloadIgnoringCache();
})
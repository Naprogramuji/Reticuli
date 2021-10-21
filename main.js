const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    mainWindow.loadFile('index.html')
    mainWindow.webContents.openDevTools()
}

function openFileFromDisk() {

    return new Promise((resolve) => {
        const { dialog } = require('electron');

        dialog.showOpenDialog({ properties: ["openFile", "showHiddenFiles"] }).then((response) => {
            resolve(response);
        });
    })
}

function readFile(path) {

    return new Promise((resolve, reject) => {
        const fs = require('fs');

        fs.readFile(path, 'utf-8', (error, code) => {
            if (error) {
                reject(error)
                return
            }

            resolve(code)
        });
    })
}

function parseCode(code, options) {
    const acorn = require("acorn")

    return acorn.parse(code, options)
}

function walk(parsedCode, comments, blockLoc, options) {

}

(async () => {
    await app.whenReady();
    createWindow()

    const path = await openFileFromDisk()
    const code = await readFile(path.filePaths[0])
    let parsedCode = null

    try {
        parsedCode = parseCode(code, {
            sourceType: 'module',
            locations: true,
            onComment: [],
            ecmaVersion: 2020
        })

        console.log(parsedCode)
    }
    catch (error) {
        console.error(error)
    }

    const xmlCode = walk(parsedCode, [], [])

})();

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
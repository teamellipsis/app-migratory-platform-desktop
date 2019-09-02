# app-migratory-platform-desktop

## Usage
``` bash
$ git clone https://github.com/teamellipsis/app-migratory-platform-desktop
$ cd app-migratory-platform-desktop
```
### Run development
Install dependencies.
``` bash
$ npm install
```
Build native node modules. (e.g. sqlite3) [Install native Node.js modules](https://electronjs.org/docs/tutorial/using-native-node-modules)
``` bash
# On UNIX
$ ./node_modules/.bin/electron-rebuild
# On Windows
$ .\node_modules\.bin\electron-rebuild.cmd
```
Run in development mode
``` bash
# On UNIX
$ npm run dev
# On Windows
$ npm run dev-win
```
### Build
``` bash
$ npm run react-build
# For linux
$ npm run pack-linux
```

# app-migratory-platform-desktop

## Usage
``` bash
$ git clone https://github.com/teamellipsis/app-migratory-platform-desktop
$ cd app-migratory-platform-desktop
```

``` bash
# Change the working directory to assets directory.
$ cd assets

# Install npm modules for agent apps.
$ npm install --production
```

Create ZIP file with the name `node_modules.zip` in `./assets`.
```
node_modules.zip
    ⊢ node_modules
        ⊢ ...
        ⊢ react
        ⊢ redux
        ⊢ next
        ⊢ ...
```

### Run development
Change the working directory to project directory.
``` bash
$ cd app-migratory-platform-desktop
```
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
# On Windows
$ npm run pack-win
```

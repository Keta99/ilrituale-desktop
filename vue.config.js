const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  configureWebpack: {
    // Modifica la configurazione di webpack qui
    // Aggiungi il supporto per SQLite
    module: {
      // Regole per gestire i file SQLite
      rules: [
        {
          test: /\.node$/,
          use: 'node-loader'
        }
      ]
    },
    resolve: {
      // Assicurati che webpack riconosca i moduli Node.js come 'fs' e 'path'
      fallback: {
        fs: false, // Disabilita 'fs' per il browser
        path: require.resolve('path-browserify')
      }
    }
  },
  transpileDependencies: [
    'vuetify'
  ],
  pluginOptions: {
    electronBuilder: {
      //mainProcessFile: 'src/background.js', // Assicurati che il percorso sia corretto
      preload: 'src/preload.js', // Assicurati che il percorso sia corretto
      nodeIntegration: true,
      builderOptions: {
        productName: "Il Rituale",
        appId: "it.keta.ilrituale",
        directories: {
          output: "dist_electron"
        },
        files: [
          "**/*",
          {
            from: "src/",
            to: "src/",
            filter: [
              "background.js",
              "preload.js",
              "dbmanager.js",
              "db.db"
            ]
          }
        ],
        dmg: {
          contents: [
            {
              x: 410,
              y: 150,
              type: "link",
              path: "/Applications"
            },
            {
              x: 130,
              y: 150,
              type: "file"
            }
          ]
        },
        win: {
          icon: "public/icon.ico",
          target: [
            {
              target: "nsis",
              arch: [
                "x64",
                "ia32"
              ]
            }
          ],
          
        },
        // extraResources: [
        //   {
        //     from: 'src/preload.js',
        //     to: 'preload.js'
        //   },
        //   {
        //     from: 'src/db.db',
        //     to: 'db.db'
        //   },
        //   {
        //     from: 'src/dbmanager.js',
        //     to: 'dbmanager.js'
        //   }
        // ],
        nsis: {
          allowElevation: true,
          shortcutName:"AgendaIlRituale",
          createDesktopShortcut:true,
          deleteAppDataOnUninstall:true,
          installerIcon:"public/icon.ico",
          uninstallerIcon:"public/icon.ico",
          oneClick:false,
          perMachine:true,
          warningsAsErrors:true,
          useZip:false,
          runAfterFinish:true,
          uninstallDisplayName:"Rimuovi"
        }
      }
    }
  }
});

/**
 * Default config to be used if environment specific config for the specific key is absent
 * Every config key to be added to `default.js` to keep a track of all config keys used in the project.
 * Use placeholders as values wherever required.
 *
 * Documentation: https://github.com/lorenwest/node-config/wiki/Configuration-Files
 */

module.exports = {
  port: 3030,
  logs: {
    enableFileLogs: true,
    enableConsoleLogs: false,
    logLevel: "http",
  },

  cors: {
    // Docs: https://www.npmjs.com/package/cors#configuration-options
    allowedOrigins: /(snipstack.com)|(\.snipstack\.com)|(localhost)/,
  },

  services: {
    backendService: {
      baseUrl: "http://localhost:3030",
    },

    uiService: {
      baseUrl: "http://localhost:3000",
      routes: {
        dashboard: "/",
      },
    },
  },

  providers: {
    mySql: {
      databaseUrl: "<DATABASE_URL>",
    },
  },
};

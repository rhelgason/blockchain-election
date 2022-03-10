const path = require("path");

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      network_id: '*',
      host: 'localhost',
      port: 7545,
    }
  },
  compilers: {
    solc: {
      version: "0.4.17",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};

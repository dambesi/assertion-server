const assert = require('assert');
const request = require('request');
const assertionData = require('../assertionData/data');
const clientServer = require('../clientServer/server');

let database = [];
let id = 0;

let controller = {
  validateServerData: (req, res, next) => {
    let serverData = req.body;
    let { studentnumber, url, endpoint, method } = serverData;
    try {
      assert(
        typeof studentnumber === 'number',
        'Student number must be a number'
      );
      assert(typeof url === 'string', 'URL must be a string');
      assert(typeof endpoint === 'string', 'Endpoint must be a string');
      assert(typeof method === 'string', 'Method must be a string');
      next();
    } catch (err) {
      const error = {
        status: 400,
        message: err.message,
        result: [],
      };
      next(error);
    }
  },

  assertEndpoint: (req, res, next) => {
    let serverData = req.body;
    serverData = {
      ...serverData,
      data: assertionData.postMovie,
    };

    clientServer.clientServerOptions(serverData, (error, result) => {
      if (result) {
        next(result);
      }
    });
  },
};

module.exports = controller;

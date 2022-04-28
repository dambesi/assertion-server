const assert = require('assert');
const saveFile = require('../results/data');
const assertionData = require('../assertionData/data');
const clientServer = require('../clientServer/server');

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
    let { studentnumber, url, endpoint, method } = serverData;
    serverData = {
      ...serverData,
      data: assertionData.postMovie,
    };

    clientServer.clientServerOptions(serverData, (error, result) => {
      if (result) {
        let code;
        console.log(result.status);
        console.log(assertionData.status);
        if (
          result.status == assertionData.postMovie.expectedStatus &&
          result.message == assertionData.postMovie.expectedMesage
        ) {
          code = 'Pass';
        } else {
          code = 'Fail';
        }

        let output = {
          studentnumber: studentnumber,
          method: method,
          endpoint: endpoint,
          status: code,
        };

        saveFile.save(output, (error, result) => {
          if (error) next(error);
        });

        let overview = {
          status: 200,
          message: code,
          result: result,
        };
        next(overview);
      }
    });
  },
};

module.exports = controller;

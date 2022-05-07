const assert = require('assert');
const saveFile = require('../results/data');
const assertionData = require('../assertionData/data');
const clientServer = require('../clientServer/server');
const fs = require('fs');

const series = require('async');
const execSync = require('child_process');
const { stdout } = require('process');

let controller = {
  validateServerData: (req, res, next) => {
    let serverData = req.body;
    let { studentnumber, url } = serverData;
    try {
      assert(
        typeof studentnumber === 'number',
        'Student number must be a number'
      );
      assert(typeof url === 'string', 'URL must be a string');
      // assert(typeof endpoint === 'string', 'Endpoint must be a string');
      // assert(typeof method === 'string', 'Method must be a string');
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
    // let serverData = req.body;
    // let { studentnumber, url } = serverData;

    execSync.exec(
      // 'mocha --no-colors test/**/*test.js --timeout 0  2>&1 | tee report.log'
      // 'mocha --timeout 0 --reporter @mochajs/json-file-reporter --reporter-options output=filename.json ',
      'mocha test/**/*test.js --reporter @mochajs/json-file-reporter --timeout 0',
      (error, stdout, stderr) => {
        console.log(`This is the stdout ${stdout}`);
        console.log(`This is the stderr ${stderr}`);

        let report = require('../../report.json');
        let { passes, failures } = report.stats;
        let data = {
          stats: { passes, failures },
          passes: report.passes,
          failures: report.failures,
        };
        let overview = {
          status: 200,
          message: 'Assertion done',
          result: data,
        };

        next(overview);
      }
    );

    // npm.load(() => npm.commands.run('test'));

    // serverData = {
    //   ...serverData,
    //   data: assertionData.postMovie,
    // };

    // clientServer.clientServerOptions(serverData, (error, result) => {
    //   if (result) {
    //     let code;
    //     console.log(result.status);
    //     console.log(assertionData.status);
    //     if (
    //       result.status == assertionData.postMovie.expectedStatus &&
    //       result.message == assertionData.postMovie.expectedMesage
    //     ) {
    //       code = 'Pass';
    //     } else {
    //       code = 'Fail';
    //     }

    //     let output = {
    //       studentnumber: studentnumber,
    //       method: method,
    //       endpoint: endpoint,
    //       status: code,
    //     };

    //     saveFile.save(output, (error, result) => {
    //       if (error) next(error);
    //     });

    //     let overview = {
    //       status: 200,
    //       message: code,
    //       result: result,
    //     };
    //     next(overview);
    //   }
    // });
  },
};

module.exports = controller;

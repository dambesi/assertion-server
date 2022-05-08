const assert = require('assert');
const fs = require('fs');

const series = require('async');
const execSync = require('child_process');
const { stdout } = require('process');
// const credentials = require('../../test/integration/credentials');

let controller = {
  validateServerData: (req, res, next) => {
    let serverData = req.body;
    let { studentnumber, url, token } = serverData;
    try {
      assert(
        typeof studentnumber === 'number',
        'Student number must be a number'
      );
      assert(typeof url === 'string', 'URL must be a string');
      assert(typeof token === 'string', 'Token must be a string');
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
    let { studentnumber, url, token } = req.body;

    process.env.studentnumber = studentnumber;
    process.env.server = url;
    process.env.token = token;

    execSync.exec(
      `mocha test/**/*test.js --reporter @mochajs/json-file-reporter --reporter-options output=${studentnumber}-report.json --timeout 0`,
      (error, stdout, stderr) => {
        let report = require(`../../${studentnumber}-report.json`);

        let { passes, failures } = report.stats;

        let data = {
          stats: { passes, failures },
          passes: report.passes,
          failures: report.failures,
        };
        let overview = {
          status: 200,
          message: `Assertion done for ${studentnumber} @ ${url} `,
          result: data,
        };

        next(overview);
      }
    );
  },
};

module.exports = controller;

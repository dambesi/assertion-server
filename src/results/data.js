const fs = require('fs');

let result = {
  save: (data, callback) => {
    let fileName = `${data.studentnumber}-assertionOutput.json`;
    fs.writeFile(fileName, JSON.stringify(data), 'utf8', (err) => {
      if (err) {
        const error = {
          status: 404,
          message: 'An error occured while writing JSON Object to File.',
          result: [],
        };
        callback(undefined, result);
      } else {
        console.log('JSON file has been saved.');
        console.log(data);
      }
    });
    // });
  },
};

module.exports = result;

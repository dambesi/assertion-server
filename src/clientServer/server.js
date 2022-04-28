const request = require('request');

let server = {
  clientServerOptions: (serverData, callback) => {
    let { url, endpoint, data, method } = serverData;
    let clientServerOptions = {
      url: url + endpoint,
      body: JSON.stringify(data),
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    console.log('Your request:');
    console.log(serverData);

    request(clientServerOptions, (err, res) => {
      let result = JSON.parse(res.body);
      callback(undefined, result);
    });
  },
};

module.exports = server;

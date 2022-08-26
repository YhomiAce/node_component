/* eslint-disable no-unused-vars */
const { messages } = require('elasticio-node');
const axios = require('axios');
const https = require('https');
const http = require('http');

exports.process = async function process(msg, cfg) {
  const that = this;
  //   const token = cfg.oauth.access_token;
  const url = 'https://jsonplaceholder.typicode.com/posts';

  try {
    const httpAgent = new http.Agent({ keepAlive: true });
    const httpsAgent = new https.Agent({ keepAlive: true });
    const config = {
      params: msg.body,
      headers: {
        Accept: 'application/json',
      },
      httpAgent,
      httpsAgent,
    };

    const payload = msg.body;
    const response = await axios.post(url, payload, config);
    const result = response.data;
    await that.emit('data', messages.newMessageWithBody({ result }));
  } catch (error) {
    await that.emit('data', messages.newMessageWithBody({ error }));
  }
};

/* eslint-disable no-unused-vars */
const { messages } = require('elasticio-node');
const axios = require('axios');
const https = require('https');
const http = require('http');

exports.process = async function process(msg, cfg) {
  const that = this;
  const { todoId } = msg.body;
  //   const token = cfg.oauth.access_token;
  let url = 'https://jsonplaceholder.typicode.com/todos';
  if (todoId !== '') {
    url = `https://jsonplaceholder.typicode.com/todos/${todoId}`;
  }

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

    const response = await axios.get(url, config);
    const result = response.data;
    await that.emit('data', messages.newMessageWithBody({ result }));
  } catch (error) {
    await that.emit('data', messages.newMessageWithBody({ error }));
  }
};

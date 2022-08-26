const { messages } = require('elasticio-node');
const axios = require('axios');
const https = require('https');
const http = require('http');

exports.process = async function process(msg, cfg) {
  const that = this;
  const url = 'https://workflow.thatapp.io/move/haven';

  try {
    const { fileURL, destination } = msg.body;

    if (!fileURL) {
      throw new Error('File_id field is required');
    }

    if (!destination) {
      throw new Error('Destination field is required');
    }

    const httpAgent = new http.Agent({ keepAlive: true });
    const httpsAgent = new https.Agent({ keepAlive: true });
    const config = {
      headers: {
        Accept: 'application/json',
      },
      httpAgent,
      httpsAgent,
    };

    const payload = {
      refresh_token: cfg.oauth.refresh_token,
      access_token: cfg.oauth.access_token,
      file_url: fileURL,
      destination,
    };
    const response = await axios.post(url, payload, config);
    const result = response.data;
    await that.emit('data', messages.newMessageWithBody({ result }));
  } catch (error) {
    await that.emit('data', messages.newMessageWithBody({ error }));
  }
};

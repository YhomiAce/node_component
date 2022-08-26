const { messages } = require('elasticio-node');
const axios = require('axios');
const https = require('https');
const http = require('http');

exports.process = async function process(msg, cfg) {
  const that = this;
  const url = 'https://workflow.thatapp.io/docuphase';

  try {
    const {
      PodioItemId, UniqueId, FirstName, LastName, LocationRef, Agency, Files, DocuPhaseURL,
    } = msg.body;

    if (!PodioItemId) {
      throw new Error('Item ID field is required');
    }
    if (!UniqueId) {
      throw new Error('Unique ID field is required');
    }
    if (!FirstName) {
      throw new Error('FirstName field is required');
    }
    if (!LastName) {
      throw new Error('Lastname field is required');
    }
    if (!LocationRef) {
      throw new Error('LocationRef field is required');
    }
    if (!Agency) {
      throw new Error('Agency field is required');
    }
    if (!Files) {
      throw new Error('File Array field is required');
    }
    if (!DocuPhaseURL) {
      throw new Error('Docuphase Url field is required');
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
      item_id: PodioItemId,
      unique_id: UniqueId,
      first_name: FirstName,
      last_name: LastName,
      location_ref: LocationRef,
      agency: Agency,
      files: JSON.stringify(Files),
      url: DocuPhaseURL,
    };
    const response = await axios.post(url, payload, config);
    const result = response.data;
    await that.emit('data', messages.newMessageWithBody({ result }));
  } catch (error) {
    await that.emit('data', messages.newMessageWithBody({ error }));
  }
};

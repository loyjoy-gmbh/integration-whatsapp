const http = require('http');
const Compute = require('@google-cloud/compute');
const compute = new Compute();

exports.whatsAppKeepalive = async (event, context, callback) => {
  try {
    const payload = _validatePayload(JSON.parse(Buffer.from(event.data, 'base64').toString()));
    _requestToken(payload, callback);
  } catch (err) {
    console.log(err);
    callback(err);
  }
};


const _requestToken = async (payload, callback) => {
  http.request({ host: payload.whatsAppHostname, path: '/v1/users/login', method: 'POST', auth: payload.whatsAppUsername + ':' + payload.whatsAppPassword }, async (response) => {
    console.log('Connection established with ' + payload.whatsAppHostname + '/v1/users/login');
    response.setEncoding('utf8');

    if (response.statusCode < 200 || response.statusCode >= 300) {
      console.warn(payload.whatsAppHostname + '/v1/users/login returned status code ' + response.statusCode);
      callback(null, await _resetVm(payload));
    } else {
      let chunks = [];

      response.on('data', (chunk) => {
        console.log('Chunk retrieved from ' + payload.whatsAppHostname + '/v1/users/login');
        chunks.push(chunk);
      }).on('end', async () => {
        console.log('Data retrieved from ' + payload.whatsAppHostname + '/v1/users/login');
        const tokenObject = JSON.parse(chunks.join());

        if (!tokenObject || !tokenObject.users || tokenObject.users.length === 0 || !tokenObject.users[0] || !tokenObject.users[0].token) {
          console.warn(payload.whatsAppHostname + '/v1/users/login is up but returns ' + tokenObject);
          callback(null, await _resetVm(payload));
        } else {
          _requestHealth(tokenObject.users[0].token, payload, callback);
        }
      });
    }
  }).on('error', async (e) => {
    console.warn(e);
    callback(null, await _resetVm(payload));
  }).end();
}

const _requestHealth = async (token, payload, callback) => {
  http.request({ host: payload.whatsAppHostname, path: '/v1/health', method: 'GET', headers: { Authorization: 'Bearer ' + token }}, async (response) => {
    console.log('Connection established with ' + payload.whatsAppHostname + '/v1/health');
    response.setEncoding('utf8');

    if (response.statusCode < 200 || response.statusCode >= 300) {
      console.warn(payload.whatsAppHostname + '/v1/health returned status code ' + response.statusCode);
      callback(null, await _resetVm(payload));
    } else {
      let chunks = [];

      response.on('data', (chunk) => {
        console.log('Chunk retrieved from ' + payload.whatsAppHostname + '/v1/health');
        chunks.push(chunk);
      }).on('end', async () => {
        console.log('Data retrieved from ' + payload.whatsAppHostname + '/v1/health');
        const healthObject = JSON.parse(chunks.join());

        if (!healthObject || !healthObject.health || !healthObject.health.gateway_status || healthObject.health.gateway_status !== 'connected') {
          console.warn(payload.whatsAppHostname + '/v1/health is up but returns ' + healthObject);
          callback(null, await _resetVm(payload));
        } else {
          const message = payload.whatsAppHostname + '/v1/health is up and WhatsApp gateway is connected -> seems everything is fine';
          console.log(message);
          callback(null, message);
        }
      })
    }
  }).on('error', async (e) => {
    console.warn(e);
    callback(null, await _resetVm(payload));
  }).end();
}

const _resetVm = async (payload) => {
  const [operation] = await compute.zone(payload.zone).vm(payload.vm).reset();
  const message = 'Successfully reset instance ' + payload.zone + '/' + payload.vm;
  console.log(message);

  return message;
};

const _validatePayload = (payload) => {
  if (!payload.zone) {
    throw new Error('Attribute zone missing from payload');
  } else if (!payload.vm) {
    throw new Error('Attribute vm missing from payload');
  } else if (!payload.whatsAppHostname) {
    throw new Error('Attribute whatsAppHostname missing from payload');
  } else if (!payload.whatsAppUsername) {
    throw new Error('Attribute whatsAppUsername missing from payload');
  } else if (!payload.whatsAppPassword) {
    throw new Error('Attribute whatsAppPassword missing from payload');
  }

  return payload;
};

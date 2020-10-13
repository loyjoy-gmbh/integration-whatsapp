const http = require('http');
const nodemailer = require('nodemailer');
const Compute = require('@google-cloud/compute');
const compute = new Compute();
const TIMEOUT = 8 * 1000;


exports.whatsAppKeepalive = async (event, context, callback) => {
  const payload = _validatePayload(JSON.parse(Buffer.from(event.data, 'base64').toString()));

  try {
    const tokenObject = await _httpRequest({ host: payload.whatsAppHostname, path: '/v1/users/login', method: 'POST', auth: payload.whatsAppUsername + ':' + payload.whatsAppPassword, timeout: TIMEOUT });

    if (!tokenObject || !tokenObject.users || tokenObject.users.length === 0 || !tokenObject.users[0] || !tokenObject.users[0].token) {
      const message = payload.whatsAppHostname + '/v1/users/login is up but returns ' + JSON.stringify(tokenObject);
      console.warn(message);
      _sendMail('Invalid token at ' + payload.whatsAppHostname + payload.whatsAppPath, message, payload);
      await _resetVm(payload);
      callback(null, message);
    } else {
      const token = tokenObject.users[0].token;

      await _httpRequest({ host: payload.whatsAppHostname, path: '/v1/stats/app', method: 'GET', headers: { Authorization: 'Bearer ' + token }, timeout: TIMEOUT });
      await _httpRequest({ host: payload.whatsAppHostname, path: '/v1/stats/db', method: 'GET', headers: { Authorization: 'Bearer ' + token }, timeout: TIMEOUT });
      const healthObject = await _httpRequest({ host: payload.whatsAppHostname, path: '/v1/health', method: 'GET', headers: { Authorization: 'Bearer ' + token }, timeout: TIMEOUT });

      if (!healthObject || !healthObject.health || !healthObject.health.gateway_status || healthObject.health.gateway_status !== 'connected') {
        const message = payload.whatsAppHostname + '/v1/health is up but returns ' + JSON.stringify(healthObject);
        console.warn(message);
        _sendMail('Invalid health object at ' + payload.whatsAppHostname + payload.whatsAppPath, message, payload);
        await _resetVm(payload);
        callback(null, message);
      } else {
        const message = payload.whatsAppHostname + '/v1/health is up and WhatsApp gateway is connected -> seems everything is fine';
        console.log(message);
        callback(null, message);
      }
    }
  } catch (err) {
    console.log(err);
    _sendMail('Error at ' + payload.whatsAppHostname, err, payload);
    await _resetVm(payload);
    callback(null, err);
  }
};


const _httpRequest = async (options) => {
  return new Promise((resolve, reject) => {
    const request = http.request(options, (response) => {
      console.log('Connection established with ' + options.host + options.path);
      response.setEncoding('utf8');

      let chunks = [];

      response.on('data', (chunk) => {
        console.log('Chunk retrieved from ' + options.host + options.path);
        chunks.push(chunk);
      }).on('end', async () => {
        console.log('Data retrieved from ' + options.host + options.path);

        const responseBody = chunks.join('');

        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(options.host + options.path + ' returned status code ' + response.statusCode + ": " + responseBody);
        } else {
          try {
            resolve(JSON.parse(responseBody));
          } catch (e) {
            reject('Could not parse JSON: ' + responseBody);
          }
        }
      });
    });

    request.on('timeout', () => {
      request.abort();
      reject('Timeout when connecting with ' + options.host + options.path);
    });

    request.on('error', (e) => {
      reject(e);
    });

    request.end();
  });
}

const _resetVm = async (payload) => {
  console.log('Resetting VM ' + payload.zone + '/' + payload.vm);
  await compute.zone(payload.zone).vm(payload.vm).reset();
};

const _sendMail = (subject, text, payload) => {
  if (payload.smtpHost && payload.smtpUsername && payload.smtpPassword && payload.smtpFrom && payload.smtpTo) {
    try {
      const transporter = nodemailer.createTransport({ host: payload.smtpHost, port: 587, auth: { user: payload.smtpUsername, pass: payload.smtpPassword }});
      const mailOptions = { from: payload.smtpFrom, to: payload.smtpTo, subject: subject, text: text };
      transporter.sendMail(mailOptions, (error, info) => { if (error) { console.log(error); } else { console.log('Sent email: ' + info.response); }});
    } catch (e) {
      console.warn(e);
    }
  }
}

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

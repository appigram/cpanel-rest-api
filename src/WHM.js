'use strict';

const _ = require('lodash');
const BaseRequest = require('./BaseRequest');
const UapiWhm = require('./UapiWhm');

class WHM extends BaseRequest {
  constructor(opts) {
    super({
      port: 2087,
      auth: getWhmAuth(opts),
      ...opts
    });
  }

  uapi(user) {
    return new UapiWhm(this, user);
  }

  async api(options) {
    options = options || {};
    const action = _.isString(options) ? options : options.action;

    const {
      params,
      opts
    } = options;

    const res = await this._request({
      ...opts,
      path: ['json-api', action],
      params: {
        ...params,
        'api.version': 1
      }
    });

    const {
      metadata,
      data
    } = res;

    if (metadata && +metadata.result === 0) {
      const error = new Error(metadata.reason);

      if (metadata) {
        error.data = data;
      }

      throw error;
    }

    return data || res;
  }
}

function getWhmAuth(creds) {
  if (creds.accessKey) {
    // WHM access hash authenticaion
    return `WHM ${creds.username}:${creds.accessKey}`;
  } else {
    // WHM access username/password
    return `Basic ${new Buffer(creds.username + ":" + creds.password).toString('base64')}`;
  }
}

module.exports = WHM;

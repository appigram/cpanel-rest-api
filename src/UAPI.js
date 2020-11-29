'use strict';

const _ = require('lodash');
const BaseRequest = require('./BaseRequest');

class UAPI extends BaseRequest {
  constructor(opts) {
    super({
      port: 2083,
      auth: getBasicAuth(opts),
      ...opts
    });
  }

  /**
   *
   * @param {object} opts
   * @param {string} opts.module
   * @param {string} opts.func
   * @param {{ [key: string]: string; }} opts.params
   */
  async api(opts) {
    if (_.isPlainObject(opts)) {
      throw new Error('opts needs to be an object');
    }

    const {
      module,
      func,
      params
    } = opts;

    const res = await this._request({
      ...opts.opts,
      path: ['execute', module, func],
      params
    });

    return this._parseUapiResult(res);
  }

  _parseUapiResult(res) {
    const {
      errors
    } = res;

    if (errors && errors.length > 0) {
      // TODO: use result.errors
      const error = new Error(errors.join('\n'));
      error.data = res;
      throw error;
    }

    return res.data;
  }
}

function getBasicAuth(opts) {
  const str = `${opts.username}:${opts.password}`;
  return `Basic ${Buffer.from(str).toString('base64')}`;
}

module.exports = UAPI;
